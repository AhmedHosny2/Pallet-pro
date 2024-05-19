import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from '../interfaces/user.interface';
import { Address } from '../interfaces/address.interface';
import { Kafka, logLevel } from 'kafkajs';
import { log } from 'console';
import e from 'express';
import { JwtService } from '@nestjs/jwt';
import { UpdateProfileDTO } from '../dtos/updateProfile.dto';

@Injectable()


export class ProfileService {
  private kafka: Kafka;
  private producer;
  private consumer;
  constructor(
    private jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>,// to use the user schema, we need to inject the user model
    @InjectModel('Address') private readonly addressModel: Model<Address>
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

  async startConsumer() {

    await this.consumer.subscribe({ topic: 'get_profile' });
    await this.consumer.subscribe({ topic: 'pre_update_profile' });
    await this.consumer.subscribe({ topic: 'post_update_profile' });
    await this.consumer.subscribe({ topic: 'pre_delete_profile' });
    await this.consumer.subscribe({ topic: 'post_delete_profile' });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        switch (topic) {
            case 'get_profile':
                console.log('Get User Profile:', JSON.parse(message.value.toString()));
                break;
            case 'pre_update_profile':
                console.log('Pre Update User Profile:', JSON.parse(message.value.toString()));
                break;
            case 'post_update_profile':
                console.log('Post Update User Profile:', JSON.parse(message.value.toString()));
                break;
            case 'pre_delete_profile':
                await this.addressModel.deleteMany({ user_id: message.value.toString() });
                console.log('Pre Delete User Profile:', JSON.parse(message.value.toString()));
                break;
            case 'post_delete_profile':
                console.log('Post Delete User Profile:', JSON.parse(message.value.toString()));
                break;
            default:
                console.log('Unknown event:', topic);
                break;
        }
      },
    });
  } catch(error) {
    console.error('Error starting consumer:', error);
    throw error;
  }

  async getProfile(userId: string): Promise<User> {
    if (!userId) { //Authentication
      throw new Error('Invalid token');
    }
    const user = await this.userModel.findById(userId);
    await this.produceEvent('get_profile', user);
    return user;
  }

  async updateProfile(userId: string, updateProfileDTO: UpdateProfileDTO): Promise<User> {
    // Checking for the address id
    const address = await this.addressModel.findById(updateProfileDTO.selected_address_id);
    if (!address) {
      throw new Error('Invalid address');
    }
    if (!userId) { //Authentication
      throw new Error('Invalid token');
    }
    if (userId !== address.user_id) {
      throw new Error('Invalid address');
    }
    if (updateProfileDTO.email) {
      const user = await this.userModel.findOne({ email: updateProfileDTO.email });
      if (user) {
        throw new Error('Email already registered for a different user');
      }
    }
    await this.produceEvent('pre_update_profile', updateProfileDTO);
    const user = await this.userModel.findByIdAndUpdate(userId, updateProfileDTO);
    await this.produceEvent('post_update_profile', user);
    return user;
  }

  async deleteProfile(userId: string): Promise<User> {
    if (!userId) { //Authentication
      throw new Error('Invalid token');
    }
    await this.produceEvent('pre_delete_profile', userId); //Send email for confirmation
    const user = await this.userModel.findByIdAndDelete(userId);
    await this.produceEvent('post_delete_profile', user);
    return user;
  }

  private async produceEvent(topic: string, value: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(value) }]
    });
  }

}
