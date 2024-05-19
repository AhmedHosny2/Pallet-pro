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
import { AddressDTO } from 'src/dtos/address.dto';

@Injectable()


export class AddressService {
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

    await this.consumer.subscribe({ topic: 'get_all_addresses' });
    await this.consumer.subscribe({ topic: 'get_selected_address' });
    await this.consumer.subscribe({ topic: 'create_address' });
    await this.consumer.subscribe({ topic: 'update_address' });
    await this.consumer.subscribe({ topic: 'delete_address' });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        switch (topic) {
            case 'get_all_addresses':
                console.log('Get All Addresses:', JSON.parse(message.value.toString()));
                break;
            case 'get_selected_address':
                console.log('Get Selected Address:', JSON.parse(message.value.toString()));
                break;
            case 'create_address':
                console.log('Create Address:', JSON.parse(message.value.toString()));
                break;
            case 'update_address':
                console.log('Update Address:', JSON.parse(message.value.toString()));
                break;
            case 'delete_address':
                console.log('Delete Address:', JSON.parse(message.value.toString()));
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

  async getAllAddresses(userId: string) {
    await this.produceEvent('get_all_addresses', userId);
    return await this.addressModel.find({ user_id: userId });
  }

  async getSelectedAddress(userId: string) {
    await this.produceEvent('get_selected_address', userId);
    const user = await this.userModel.findById(userId);
    return await this.addressModel.findById(user.selected_address_id);
  }

  async createAddress(userId: string, address: AddressDTO) {
    const newAddress = new this.addressModel({ user_id: userId, ...address });
    await newAddress.save();
    await this.produceEvent('create_address', newAddress);
    return newAddress;
  }

  async updateAddress(userId: string, addressId: string, address: AddressDTO) {
    address.updated_at = new Date();
    const updatedAddress = await this.addressModel.findOneAndUpdate({ user_id: userId, _id: addressId }, address);
    await this.produceEvent('update_address', updatedAddress);
    return updatedAddress;
  }

  async deleteAddress(userId: string, addressId: string) {
    const deletedAddress = await this.addressModel.findOneAndDelete({ user_id: userId, _id: addressId });
    await this.produceEvent('delete_address', deletedAddress);
    return deletedAddress;
  }

  private async produceEvent(topic: string, value: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(value) }]
    });
  }

}
