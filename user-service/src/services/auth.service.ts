import { Injectable } from '@nestjs/common';
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
import { VerifyEmailDto } from 'src/dtos/verify-email.dto';


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
  ) {
    this.googleOAuthClient = new OAuth2Client({
      clientId:
        '142166430996-t99imiu4efu85ohe2uqaefgd02ea4d7o.apps.googleusercontent.com',
      clientSecret: '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',
      redirectUri: 'http://localhost:3000/auth/google/callback',
    });

    this.kafka = new Kafka({
      clientId: 'user-service',
      brokers: ['localhost:9092'],
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
    await this.consumer.subscribe({ topic: 'add_to_wishlist' });
    console.log(
      'Consumer subscribed to topics: user_register, user_login, user_reset_password, add_to_wishlist',
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
            case 'add_to_wishlist':
            console.log(
              'User added to wishlist:',
              JSON.parse(message.value.toString()),
            );
            this.addToWishlist(JSON.parse(message.value.toString()));
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
      throw new Error('User not found');
    }

    if(!user.verified){
      throw new Error('User not verified');
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
      throw new Error('Invalid password');
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

    return tokens;
  }

  // async logout(userId: string): Promise<void> {
  //   const user = await this.userModel.findById(userId).exec();
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   // remove the refresh token
  //   await this.updateRefreshToken(user._id, null);
  // }

  async googleLogin(req: any): Promise<{ token: string }> {
    const token = req.headers.authorization.split(' ')[1]; // Extract token from authorization header

    const ticket = await this.googleOAuthClient.verifyIdToken({
      idToken: token,
      audience:
        '142166430996-t99imiu4efu85ohe2uqaefgd02ea4d7o.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const email = payload['email'];

    // Check if the user exists in the database
    let user = await this.findUserByEmail(email);

    if (!user) {
      // If the user does not exist, register them
      const newUser: RegisterDTO = {
        email: email,
        password: 'tempPassword',
        first_name: payload['given_name'] || '',
        last_name: payload['family_name'] || '',
      };

      user = await this.register(newUser);
    }

    // Produce the login event
    await this.produceEvent('user_login', { email });

    // Generate JWT token
    const authToken = this.jwtService.sign({
      email: user.email,
      sub: user._id,
    });

    return { token: authToken };
}
async register(registerDto: RegisterDTO): Promise<User> {
  try {
    if (await this.findUserByEmail(registerDto.email)) {
      throw new Error('User already exists');
    }
    const hashedPassword = await hash(registerDto.password, 10);
    console.log('Password hashed successfully:', hashedPassword);

    const verificationCode = Math.random().toString(36).substring(2, 8); // Generate verification code
    const userDto = { ...registerDto, password: hashedPassword }; // we hashed the password
    const registeredUser = await this.registerUser(userDto, verificationCode); // Pass verification code
    await this.sendVerificationEmail(registerDto.email, verificationCode); // Pass verification code

      // produce the register event
      await this.produceEvent('user_register', { email: registerDto.email });
      console.log('User register event produced.');

    return registeredUser;  
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// user rate product
  // it will connect with product service using kafak
  // it will send the rating and the product id
  // it will also send the user id
  async rateProduct(rateProductDto: RateProductDto, id: string): Promise<void> {
    // I need to send it ot client_id =>  product_service  group id => product_service_id

    await this.producer.send({
      topic: 'rate_product',
      messages: [{ value: JSON.stringify({ id, rateProductDto }) }],
    });
  }

  async resetPassword(email: string, resetCode: string, newPassword: string): Promise<void> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // validate the reset code
    if (user.resetCode !== resetCode) {
      throw new Error('Invalid reset code');
    }

    // hash the new password
    const hashedPassword = await hash(newPassword, 10);
    console.log('Password hashed successfully:', hashedPassword);

    // update the user's password
    user.password = hashedPassword;
    user.resetCode = null;
    await this.produceEvent('user_reset_password', { email });
    await user.save();
  }

  async generateResetCode(email: string): Promise<string> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // generate a random reset code
    const resetCode = Math.random().toString(36).substring(2, 8);
    console.log('Reset code generated:', resetCode);

    // update the user's reset code
    user.resetCode = resetCode;
    await user.save();

    // send the reset code to the user
    await this.sendPasswordResetEmail(email, resetCode);
    console.log('Password reset email sent.');

    return resetCode;
  }

  async verifyEmail(email: string, verificationCode: string): Promise<User> {
    const user = await this.findUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }

    // Log the verification codes for debugging
    console.log('User Verification Code:', user.verificationCode);
    console.log('Input Verification Code:', verificationCode);

    // Check if the verification codes match
    if (user.verificationCode !== verificationCode) {
        throw new Error('Invalid verification code');
    }

    // If the verification codes match, proceed with verification
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
      const user = new this.userModel({ ...registerDTO, verificationCode });
      // await this.sendVerificationEmail(registerDTO.email, verificationCode);
      return user.save();
    }
  
    async findUserByEmail(email: string): Promise<User | null> { // this method takes an email as input and returns a User object or null if not found.
      return this.userModel.findOne({ email }).exec();
    }

    async sendEmail(receiver: string, subject: string, content: string): Promise<void> {
      await this.mailerService.sendMail({
        to: receiver,
        subject: subject,
        html: content,
      });
    }

    async sendVerificationEmail(email: string, verificationCode: string): Promise<void> {
      const content = `<p>Your verification code is: ${verificationCode}</p>`;
      await this.sendEmail(email, 'Email Verification Code', content);
      await this.userModel.updateOne({ email },{ verificationCode })
    }
    

  async sendPasswordResetEmail(
    email: string,
    resetCode: string,
  ): Promise<void> {
    const content = `<p>Your password reset code is: ${resetCode}</p>`;
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
    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'secret',
          expiresIn: '60s',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'refreshSecret',
          expiresIn: '120s', // change laterrrrrrrrrrr
        },
      ),
    ]);
    return { token, refreshToken };
  }

  // send user email so far until auth service
  async addToWishlist(wishlistItem: any): Promise<void> {
    console.log('Adding to wishlist:', wishlistItem);
    const user = await this.findUserByEmail(wishlistItem.email);
    if (!user) {
      throw new Error('User not found');
    }
    // befo0re adding to wishlist, check if the product is already in the wishlist
    if (user.wishList.includes(wishlistItem)) {
      throw new Error('Product already in wishlist');
      
    }
    user.wishList.push(wishlistItem);
    await user.save();
    console.log('Added to wishlist:', wishlistItem);
  }
  // view all user's wish-list
  async getWishlist(data: any): Promise<any> {
    const {email} = data
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user.wishList;
  }
  async deleteWishlist(id: string, email: string): Promise<any> {
  
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    user.wishList = user.wishList.filter((item) => item.id !== id);
    await user.save();
    return user.wishList;
  }
}
