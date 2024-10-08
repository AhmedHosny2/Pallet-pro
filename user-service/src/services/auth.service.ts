import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDTO } from '../dtos/register.dto';
import { User } from '../interfaces/user.interface';
import { compare, hash } from 'bcrypt';
import { Kafka, logLevel } from 'kafkajs';
import { log } from 'console';
import e from 'express';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { OAuth2Client } from 'google-auth-library';
import { RateProductDto } from 'src/dtos/rateProductDto.dto';
import { ProfileService } from './profile.service';
import { v4 as uuidv4 } from 'uuid';
// import * as IP from 'ip';

@Injectable()
export class AuthService {
  private googleOAuthClient: OAuth2Client;
  private kafka: Kafka;
  private producer;
  private consumer;
  constructor(
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    @InjectModel('User') private readonly userModel: Model<User>, // to use the user schema, we need to inject the user model
    private profileService: ProfileService,
  ) {
    this.googleOAuthClient = new OAuth2Client({
      clientId:
        '142166430996-t99imiu4efu85ohe2uqaefgd02ea4d7o.apps.googleusercontent.com',
      clientSecret: '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',
      redirectUri: 'http://localhost:3000/auth/google/callback',
    });

    this.kafka = new Kafka({
      clientId: 'user-service',
      brokers: ['kafka:9092'],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'user-service-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async startConsumer() {
    await this.consumer.subscribe({ topic: 'user_register' });
    await this.consumer.subscribe({ topic: 'user_login' });
    await this.consumer.subscribe({ topic: 'user_reset_password' });
    console.log(
      'Consumer subscribed to topics: user_register, user_login, user_reset_password',
    );

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        switch (topic) {
          case 'user_register':
            console.log(
              'User registered:',
              JSON.parse(message.value.toString()),
            );
            break;
          case 'user_login':
            const { email } = JSON.parse(message.value.toString());
        const user = await this.findUserByEmail(email);
        if (user) {
          //this.kafkaService.produceEvent('user_logged_in', { userId: user._id, email });
          this.producer.send({ topic: 'user_logged_in', messages: [{ value: JSON.stringify({ userId: user._id, email }) }] });
        }
            console.log(
              'User logged in:',
              JSON.parse(message.value.toString()),
            );
            break;
          case 'user_reset_password':
            console.log(
              'User reset password:',
              JSON.parse(message.value.toString()),
            );
            break;
          default:
            console.log('Unknown event:', topic);
            break;
        }
      },
    });
  }
  catch(error) {
    console.error('Error starting consumer:', error);
    throw error;
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    // takes LoginDTO as input and returns a session identifier. Why do we use a promise? Because the login operation is asynchronous so we handle operations that take time to complete. this will return a session id (for now) but it may not be available immediately
    // to be done: change this to jwt token instead of session id
    const { email, password } = loginDto;
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', 400);
    }

    if(!user.verified){
      await this.sendVerificationEmail(user.email, user.verificationCode);
      throw new HttpException('User not verified', 401);
    }

    // print all the data from the user
    console.log(
      user.email,
      user.password,
      user.first_name,
      user.last_name,
      user.role,
      user.created_at,
      user.updated_at,
    );
    console.log(password, user.password);
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpException('Invalid password', 400);
    }

    // produce the login event
    await this.produceEvent('user_login', { email: loginDto.email });

    //HEREEE
    const tokens = await this.getTokens(user._id, user.email);
    console.log('Tokens generated:', tokens);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    //ABOVEEEEE

    // generate the jwt token
    //    const token = this.jwtService.sign({ email: user.email, sub: user._id });
    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);
    console.log('Token generated:', token);
    return {token};
  }

  async register(registerDto: RegisterDTO): Promise<User> {
    try {
      if (!registerDto.email || !registerDto.password || !registerDto.first_name || !registerDto.last_name || !registerDto.address_name || !registerDto.country || !registerDto.city || !registerDto.address_line_1 || !registerDto.zip_code) {
        throw new HttpException('Missing required fields', 400);
      }
      if (registerDto.password.length < 8) {
        throw new HttpException('Password must be at least 8 characters long', 400);
      }
      if (registerDto.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) === null) {
        throw new HttpException('Invalid email address', 400);
      }
      if (registerDto.phone_number.match(/^[0-9]{11}$/) === null) {
        throw new HttpException('Invalid phone number', 400);
      }
      if (registerDto.zip_code.match(/^[0-9]{5}$/) === null) {
        throw new HttpException('Invalid zip code', 400);
      }
      if (registerDto.country.length < 3) {
        throw new HttpException('Invalid country', 400);
      }
      if (await this.findUserByEmail(registerDto.email)) {
        throw new HttpException('User already exists', 400);
      }
      const hashedPassword = await hash(registerDto.password, 10);
      console.log('Password hashed successfully:', hashedPassword);

      const verificationCode = uuidv4() + uuidv4() + uuidv4() + uuidv4();
      const userDto = { ...registerDto, password: hashedPassword }; // we hashed the password
      const registeredUser = await this.registerUser(userDto, verificationCode); // Pass verification code
      await this.sendVerificationEmail(registerDto.email, verificationCode); // Pass verification code

      // produce the register event
      await this.produceEvent('user_register', { email: registerDto.email });
      console.log('User register event produced.');

      return registeredUser;  
    } catch (error) {
      console.error('Error registering user:', error);
      throw new HttpException('Error registering user ' + error, 400);
    }
  }

  async resetPassword(resetCode: string, newPassword: string): Promise<string> {
    console.log('ResetPassword method called with resetCode:', resetCode);
    const user = await this.userModel.findOne({resetCode}); 
    if (!user) {
      console.log('User not found');
      throw new HttpException('User not found', 400);
    }
    console.log('User found:', user);

    // hash the new password
    const hashedPassword = await hash(newPassword, 10);
    console.log('Password hashed successfully:', hashedPassword);

    // update the user's password
    user.password = hashedPassword;
    user.resetCode = null;
    await this.produceEvent('user_reset_password', user.email);
    await user.save();
    return "Password reset successfully.";
  }

  async generateResetCode(email: string): Promise<string> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', 400);
    }

    // generate a random reset code
    const resetCode = uuidv4() + uuidv4() + uuidv4() + uuidv4();
    console.log('Reset code generated:', resetCode);

    // update the user's reset code
    user.resetCode = resetCode;
    await user.save();

    // send the reset code to the user
    await this.sendPasswordResetEmail(email, resetCode);
    console.log('Password reset email sent.');

    return resetCode;
  }

  async verifyEmail(verificationCode: string): Promise<User> {
    const user = await this.userModel.findOne({ verificationCode: verificationCode });
    if (!user) {
        throw new HttpException('User not found', 400);
    }

    if (user.verified) {
      return user;
    }

    user.verified = true;
    user.verificationCode = null;
    await user.save();
    return user;
  }

  private async produceEvent(topic: string, value: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(value) }],
    });
  }

  async registerUser(registerDTO: RegisterDTO, verificationCode: string): Promise<User> {
    console.log('RegisterUser method called with email:', registerDTO.email)
    const user = await this.userModel.create({
      email: registerDTO.email,
      password: registerDTO.password,
      first_name: registerDTO.first_name,
      last_name: registerDTO.last_name,
      role: 'user',
      verificationCode: verificationCode,
      created_at: new Date(),
      verified: false,
    });
    const address = await this.profileService.createAddress(user.id, {
      name: registerDTO.address_name,
      country: registerDTO.country,
      city: registerDTO.city,
      address_line_1: registerDTO.address_line_1,
      address_line_2: registerDTO.address_line_2,
      zip_code: registerDTO.zip_code,
      phone_number: registerDTO.phone_number,
      id: null
    });
    await this.userModel.updateOne({ email: registerDTO.email }, { selected_address_id: address.id });
    // await this.sendVerificationEmail(registerDTO.email, verificationCode);
    return user;
  }
  
  async findUserByEmail(email: string): Promise<User | null> { // this method takes an email as input and returns a User object or null if not found.
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return null;
    }
    return user;
  }

  async sendEmail(receiver: string, subject: string, content: string): Promise<void> {
    await this.mailerService.sendMail({
      to: receiver,
      subject: subject,
      html: content,
    });
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.userModel.findOne({email});
    if (!user) {
      throw new HttpException('User not found', 400);
    }
    if (user.verified) {
      throw new HttpException('User already verified', 400);
    }
    await this.sendVerificationEmail(email, user.verificationCode);
  }

  async sendVerificationEmail(email: string, verificationCode: string): Promise<void> {
    const content = `<p>Your verification link is: ${"http://localhost:5001/auth/verify-email/" + verificationCode}</p>`;
    await this.sendEmail(email, 'Email Verification Link', content);
    await this.userModel.updateOne({ email },{ verificationCode })
  }
  
  async sendPasswordResetEmail(
    email: string,
    resetCode: string,
  ): Promise<void> {
    const content = `<p>Your password reset link is: http://localhost:3000/verifyResetPassword?verificationCode=${resetCode}</p>`;
    await this.sendEmail(email, 'Password Reset Verification Code', content);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = refreshToken
      ? await hash(refreshToken, 10)
      : null;
    await this.userModel.updateOne(
      { _id: userId },
      { refreshToken: hashedRefreshToken },
    );
  }

  async getTokens(
    userId: string,
    email: string,
  ): Promise<{ token: string; refreshToken: string }> {
    console.log('Generating tokens for user:', userId);
    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'Darwizzy',
          expiresIn: '2000s',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'refreshSecret',
          expiresIn: '4000s', // change laterrrrrrrrrrr
        },
      ),
    ]);
    return { token, refreshToken };
  }
}
