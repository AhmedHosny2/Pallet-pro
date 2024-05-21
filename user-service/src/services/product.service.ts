import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from '../interfaces/user.interface';
import { Kafka } from 'kafkajs';
import { JwtService } from '@nestjs/jwt';
import { RateProductDto } from 'src/dtos/rateProductDto.dto';
import { CreateWishlistDTO } from 'src/dtos/wishlistCreate.dto';
import { AddToWishlistDTO } from 'src/dtos/wishListAdd';
import { RemoveFromWishlistDTO } from 'src/dtos/wishlistRemove.dto';
import { DeleteWishlistDTO } from 'src/dtos/wishlistDelete';
import { GetWishlistDTO } from 'src/dtos/wishlistGet';

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

  async createWishlist(userId: string, createWishlistDTO: CreateWishlistDTO): Promise<string> {
    const user = await this.userModel.findById(userId);
    if (!user.wishLists) {
      user.wishLists = [];
    }
    if (user.wishLists.find((item) => item.name === createWishlistDTO.name)) {
      throw new HttpException('Wishlist already exists', 400);
    }
    user.wishLists.push({
      name: createWishlistDTO.name,
      image: createWishlistDTO.image,
      price: 0,
      products: [],
    });
    await user.save();
    return 'Wishlist created';
  }

  async addToWishlist(userId: string, addToWishlistDTO: AddToWishlistDTO ): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user.wishLists){
      user.wishLists = [];
    }
    const wishlist = user.wishLists.find((item) => item.name === addToWishlistDTO.wishListName);
    if (!wishlist) {
      throw new HttpException('Wishlist not found', 400);
    }
    if (!wishlist.products) {
      wishlist.products = [];
    }
    const product = wishlist.products.find((item) => item.id === addToWishlistDTO.productId);
    if (product) {
      product.amount = addToWishlistDTO.amount;
      product.price = addToWishlistDTO.price;
    } else {
      wishlist.products.push({
        id: addToWishlistDTO.productId,
        price: addToWishlistDTO.price,
        amount: addToWishlistDTO.amount,
      });
    }
    wishlist.price = wishlist.products.reduce((acc, item) => acc + item.price, 0);
    await user.save();
    return {message: 'Product added to wishlist', wishlist: wishlist};
  }

  async removeFromWishlist(userId: string, removeFromWishlistDTO: RemoveFromWishlistDTO): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user.wishLists) {
      user.wishLists = [];
    }
    const wishlist = user.wishLists.find((item) => item.name === removeFromWishlistDTO.wishListName);
    if (!wishlist) {
      throw new HttpException('Wishlist not found', 400);
    }
    const product = wishlist.products.find((item) => item.id === removeFromWishlistDTO.productId);
    if (!product) {
      throw new HttpException('Product not found', 400);
    }
    wishlist.products = wishlist.products.filter((item) => item.id !== removeFromWishlistDTO.productId);
    wishlist.price = wishlist.products.reduce((acc, item) => acc + item.price, 0);
    await user.save();
    return {message: 'Product removed from wishlist', wishlist: wishlist};
  }

  async getWishlist(userId: string, getWishlistDTO: GetWishlistDTO): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user.wishLists){
      user.wishLists = [];
    }
    const wishlist = user.wishLists.find((item) => item.name === getWishlistDTO.wishListName);
  }
  
  async deleteWishlist(userId: string, deleteWishlistDTO: DeleteWishlistDTO): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user.wishLists) {
      user.wishLists = [];
    }
    user.wishLists = user.wishLists.filter((item) => item.name !== deleteWishlistDTO.wishListName);
    await user.save();
    return user.wishLists;
  }

  async getAllWishlists(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user.wishLists) {
      user.wishLists = [];
    }
    return user.wishLists;
  }

}