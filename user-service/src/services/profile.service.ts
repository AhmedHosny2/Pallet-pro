import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from '../interfaces/user.interface';
import { Address } from '../interfaces/address.interface';
import { Kafka, logLevel } from 'kafkajs';
import { log } from 'console';
import e from 'express';
import { JwtService } from '@nestjs/jwt';
import { UpdateProfileDTO } from '../dtos/updateProfile.dto';
import { AddressDTO } from '../dtos/address.dto';
import { ConfirmUpdatePasswordDTO } from '../dtos/confirmUpdatePassword.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { hash } from 'bcrypt';
import { AuthService } from './auth.service';
import { auth } from 'google-auth-library';

@Injectable()


export class ProfileService {
  private kafka: Kafka;
  private producer;
  private consumer;
  private updatePasswordsCodes = new Map();
  private deleteAccountsCodes = new Map();
  constructor(
    private jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>,// to use the user schema, we need to inject the user model
    @InjectModel('Address') private readonly addressModel: Model<Address>,
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
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
    await this.consumer.subscribe({ topic: 'get_all_addresses' });
    await this.consumer.subscribe({ topic: 'get_selected_address' });
    await this.consumer.subscribe({ topic: 'create_address' });
    await this.consumer.subscribe({ topic: 'update_address' });
    await this.consumer.subscribe({ topic: 'delete_address' });
    await this.consumer.subscribe({ topic: 'pre_update_password' });
    await this.consumer.subscribe({ topic: 'post_update_password' });

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
            case 'get_all_addresses':
                console.log('Get All Addresses:', JSON.parse(message.value.toString()));
                break;
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
            case 'pre_update_password':
                console.log('Pre Update Password:', JSON.parse(message.value.toString()));
                break;
            case 'post_update_password':
                console.log('Post Update Password:', JSON.parse(message.value.toString()));
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
    const user = await this.userModel.findById(userId);
    user.password = undefined;
    user.verificationCode = undefined;
    await this.produceEvent('get_profile', user);
    return user;
  }
  
  async updatePassword(userId: string): Promise<String> {
    const user = await this.userModel.findById(userId);
    const email = user.email;
    const code = Math.floor(100000 + Math.random() * 900000);
    const content = `<p>Your password update verification code is: ${code}</p>`;
    await this.mailerService.sendMail({
      to: email,
      subject: "Password Update Verification Code",
      html: content,
    });
    this.updatePasswordsCodes.set(userId, code);
    setTimeout(() => {
      this.updatePasswordsCodes.delete(userId);
    }
    , 300000); //5 minutes
    await this.produceEvent('pre_update_password', userId);
    return "Code sent to email";
  }
  
  async confirmUpdatePassword(userId: string, updatePasswordDTO: ConfirmUpdatePasswordDTO): Promise<User> {
    console.log('Codes:', this.updatePasswordsCodes);
    if (!this.updatePasswordsCodes.has(userId)) {
      throw new HttpException('No code sent/Code Expired', 400);
    }
    if (this.updatePasswordsCodes.get(userId) !== updatePasswordDTO.code) {
      throw new HttpException('Invalid code', 400);
    }
    this.updatePasswordsCodes.delete(userId);
    const hashedPassword = await hash(updatePasswordDTO.password, 10);;
    const user = await this.userModel
      .findByIdAndUpdate(userId, { password: hashedPassword });
    await this.produceEvent('post_update_password', user);
    return user;
  }

  async updateProfile(userId: string, updateProfileDTO: UpdateProfileDTO): Promise<User> {
    await this.produceEvent('pre_update_profile', updateProfileDTO);
    const address = await this.addressModel.findById(updateProfileDTO.selected_address_id);
    if (address && userId !== address.user_id) {
      throw new HttpException('Invalid address', 400);
    }
    let user = await this.userModel.findById(userId);
    if (updateProfileDTO.email) {
      const userWithEmail = await this.userModel.findOne({ email: updateProfileDTO.email });
      if (userWithEmail) {
        throw new HttpException('Email already in use', 400);
      }
      else {
        const email = updateProfileDTO.email;
        const code = Math.floor(100000 + Math.random() * 900000);
        const content = `<p>Your email update verification code is: ${code}</p>`;
        await this.mailerService.sendMail({
          to: email,
          subject: "Email Update Verification Code",
          html: content,
        });
        user = await this.userModel.findByIdAndUpdate(userId, {
          verificationCode: code,
          verified: false,
          email: email,
          updated_at: new Date(),
          selected_address_id: updateProfileDTO.selected_address_id,
          first_name: updateProfileDTO.first_name,
          last_name: updateProfileDTO.last_name
        });
        user.password = undefined;
        user.verificationCode = undefined;

      }
    }
    await this.produceEvent('post_update_profile', user);
    return user;
  }

  async deleteProfile(userId: string): Promise<String> {
    await this.produceEvent('pre_delete_profile', userId); //Send email for confirmation
    const user = await this.userModel.findById(userId);
    const email = user.email;
    const code = Math.floor(100000 + Math.random() * 900000);
    const content = `<p>Your account deletion verification code is: ${code}</p>`;
    await this.mailerService.sendMail({
      to: email,
      subject: "Account Deletion Verification Code",
      html: content,
    });
    this.deleteAccountsCodes.set(userId, code);
    setTimeout(() => {
      this.deleteAccountsCodes.delete(userId);
    }
    , 300000); //5 minutes
    return "Code sent to email";
  }

  async confirmDeleteProfile(userId: string, code: number): Promise<User> {
    if (!this.deleteAccountsCodes.has(userId)) {
      throw new HttpException('No code sent/Code Expired', 400);
    }
    if (this.deleteAccountsCodes.get(userId) !== code) {
      throw new HttpException('Invalid code', 400);
    }
    this.deleteAccountsCodes.delete(userId);
    const user = await this.userModel.findByIdAndDelete(userId);
    // Remove all addresses
    await this.addressModel.deleteMany({ user_id: userId });
    // Remove all carts
    // To be implemented
    // Remove all orders
    // To be implemented
    // Remove all reviews
    // To be implemented
    // Remove all payments
    // To be implemented

    await this.produceEvent('post_delete_profile', user);
    return user;
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
