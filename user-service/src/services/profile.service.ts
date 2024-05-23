import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
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
import { auth } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
// import * as IP from 'ip';

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
  ) {
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

  async getProfile(userId: string): Promise<any> {//
    const user = await this.userModel.findById(userId);
    const address = await this.addressModel.findOne({ user_id: userId, _id: user.selected_address_id });
    user.password = undefined;
    user.verificationCode = undefined;
    await this.produceEvent('get_profile', user);
    return {user, address};
  }
  
  async updatePassword(userId: string): Promise<any> {
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
    return {message: 'Code sent to email'};
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

  async updateProfile(userId: string, updateProfileDTO: UpdateProfileDTO): Promise<User> {//
    await this.produceEvent('pre_update_profile', updateProfileDTO);
    if (updateProfileDTO.selected_address_id) {
      const address = await this.addressModel.findById(updateProfileDTO.selected_address_id);
      console.log('Address:', address);
      console.log('User:', userId);
      console.log('Address User:', address.user_id.toString());
      if (address && userId as String !== address.user_id.toString()) {
        throw new HttpException('Invalid address', 400);
      }
    }
    let user = await this.userModel.findById(userId);
    if (updateProfileDTO.email != user.email) {
      const userWithEmail = await this.userModel.findOne({ email: updateProfileDTO.email });
      if (userWithEmail && userWithEmail._id.toString() !== userId){
        throw new HttpException('Email already in use', 400);
      }
      const email = updateProfileDTO.email;
      const verificationCode = uuidv4() + uuidv4() + uuidv4() + uuidv4();
      console.log('Verification Code:', verificationCode);
      const content = `<p>Your verification link is: ${"http://localhost:5000/auth/verify-email/" + verificationCode}</p>`;
      await this.mailerService.sendMail({
        to: email,
        subject: "Email Update Verification Link",
        html: content,
      });
      user.verified = false;
      user.verificationCode = verificationCode;
      user.email = email;
    }
    user.first_name = updateProfileDTO.first_name;
    user.last_name = updateProfileDTO.last_name;
    user.selected_address_id = updateProfileDTO.selected_address_id;
    user.updated_at = new Date();
    await user.save();

    user.password = undefined;
    user.verificationCode = undefined;

    await this.produceEvent('post_update_profile', user);
    return user;
  }

  async deleteProfile(userId: string): Promise<any> {
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
    return {message: 'Code sent to email'};
  }

  async confirmDeleteProfile(userId: string, code: number): Promise<any> {
    if (!this.deleteAccountsCodes.has(userId)) {
      throw new HttpException('No code sent/Code Expired', 400);
    }
    console.log('Codes:', this.deleteAccountsCodes.get(userId), code);
    if (this.deleteAccountsCodes.get(userId) != code) {
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
    return {message: 'Account deleted'};
  }

  async getAllAddresses(userId: string) {//
    await this.produceEvent('get_all_addresses', userId);
    return await this.addressModel.find({ user_id: userId });
  }

  async getSelectedAddress(userId: string) {//
    await this.produceEvent('get_selected_address', userId);
    const user = await this.userModel.findById(userId);
    return await this.addressModel.findById(user.selected_address_id);
  }

  async createAddress(userId: string, address: AddressDTO) {//
    if (!address.name || !address.country || !address.city || !address.address_line_1 || !address.zip_code || !address.phone_number) {
      throw new HttpException('Missing fields', 400);
    }
    console.log('Create Address:', userId, address);
    const addressExists = await this.addressModel.findOne({ user_id: userId, name: address.name });
    if (addressExists) {
      throw new HttpException('Address already exists', 400);
    }
    const newAddress = await this.addressModel.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: userId, 
      name: address.name,
      country: address.country,
      city: address.city,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      phone_number: address.phone_number,
      zip_code: address.zip_code,
      created_at: new Date(),
    });
    console.log('New Address:', newAddress);
    await this.produceEvent('create_address', newAddress);
    return newAddress;
  }

  async updateAddress(userId: string, address: AddressDTO) {//
    const updatedAddress = await this.addressModel.findOneAndUpdate({ user_id: userId, id: address.id }, {
      name: address.name,
      country: address.country,
      city: address.city,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      phone_number: address.phone_number,
      zip_code: address.zip_code,
      updated_at: new Date(),
    });
    await this.produceEvent('update_address', updatedAddress);
    return updatedAddress;
  }

  async deleteAddress(userId: string, addressId: string) {//
    const user = await this.userModel.findById(userId);
    if (user.selected_address_id.toString() == addressId) {
      throw new HttpException('Cannot delete selected address', 400);
    }
    console.log('Delete Address:', userId, addressId);
    const deletedAddress = await this.addressModel.findOneAndDelete({ _id: addressId });
    console.log('Deleted Address:', deletedAddress);
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
