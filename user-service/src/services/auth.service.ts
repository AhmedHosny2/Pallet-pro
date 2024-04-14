import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginDto } from '../dtos/login.dto';
import { RegisterDTO } from '../dtos/register.dto';
import { User } from '../interfaces/user.interface';
import { compare, hash } from 'bcrypt';
import {Kafka, logLevel} from 'kafkajs';
import { log } from 'console';
import e from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()


export class AuthService {
    private kafka: Kafka;
    private producer;
    private consumer;
  constructor(
    private jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>,// to use the user schema, we need to inject the user model
  ) {
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

    async startConsumer(){

        await this.consumer.subscribe({ topic: 'user_register' });
        await this.consumer.subscribe({ topic: 'user_login' });
        console.log('Consumer subscribed to topics: user_register, user_login');

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
              switch (topic) {
                case 'user_register':
                  console.log('User registered:', JSON.parse(message.value.toString()));
                  break;
                case 'user_login':
                  console.log('User logged in:', JSON.parse(message.value.toString()));
                  break;
                default:
                  console.log('Unknown event:', topic);
                  break;
              }
            },
          });
        } catch (error) {
          console.error('Error starting consumer:', error);
          throw error;
        }


  async login(loginDto: LoginDto): Promise<{ token: string }> { // takes LoginDTO as input and returns a session identifier. Why do we use a promise? Because the login operation is asynchronous so we handle operations that take time to complete. this will return a session id (for now) but it may not be available immediately
    // to be done: change this to jwt token instead of session id
    const { email, password } = loginDto;
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // print all the data from the user
    console.log(user.email, user.password, user.first_name, user.last_name, user.role, user.created_at, user.updated_at);
    console.log(password, user.password);
    if (password !== user.password) {
      throw new Error('Invalid password');
    }

    // produce the login event
    await this.produceEvent('user_login', { email: loginDto.email });

    // generate the jwt token
    const token = this.jwtService.sign({ email: user.email, sub: user._id });

    return {token}; 
  }

  async register(registerDto: RegisterDTO): Promise<User> {
    const hashedPassword = await hash(registerDto.password, 10);
    const userDto = { ...registerDto, password: hashedPassword }; // we hashed the password

    const toBeReturned = await this.registerUser(userDto); // we call the registerUser method from the UserService class and pass the userDto to store the user data in the database

    // produce the register event
    await this.produceEvent('user_register', { email: registerDto.email });

    return toBeReturned; 
  }

  private generateSessionId(): string {
    // Generate a session identifier using any suitable method
    // For simplicity, let's use a simple random string generator bas we will change it to jwt token later
    const randomString = Math.random().toString(36).substring(2);
    return randomString;
  }

  private async produceEvent(topic: string, value: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(value) }]
    }); 
    }

    async registerUser(registerDTO: RegisterDTO): Promise<User> { // this method takes a RegisterDTO as input and returns a User object.
      const user = new this.userModel(registerDTO);
      return user.save();
    }
  
    async findUserByEmail(email: string): Promise<User | null> { // this method takes an email as input and returns a User object or null if not found.
      return this.userModel.findOne({ email }).exec();
    }

}
