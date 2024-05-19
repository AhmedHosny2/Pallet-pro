import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from '../interfaces/user.interface';
import { Kafka } from 'kafkajs';
import { JwtService } from '@nestjs/jwt';
import { RateProductDto } from 'src/dtos/rateProductDto.dto';

@Injectable()
export class ProductService {
    private kafka: Kafka;
    private producer;
    private consumer;
    constructor(
      private jwtService: JwtService,
      @InjectModel('User') private readonly userModel: Model<User>
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
  
      await this.consumer.subscribe({ topic: 'rate_product' });
  
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          switch (topic) {
                case 'rate_product':
                    console.log('Rate Product:', JSON.parse(message.value.toString()));
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

  // send user email so far until auth service
  async addToWishlist(wishlistItem: any): Promise<void> {
    console.log('Adding to wishlist:', wishlistItem);
    const user = await this.userModel.findOne({email: wishlistItem.email});
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
    const user = await this.userModel.findOne({email});
    if (!user) {
      throw new Error('User not found');
    }
    return user.wishList;
  }
  async deleteWishlist(id: string, email: string): Promise<any> {
  
    const user = await this.userModel.findOne({email});
    if (!user) {
      throw new Error('User not found');
    }
    user.wishList = user.wishList.filter((item) => item.id !== id);
    await user.save();
    return user.wishList;
  }

}