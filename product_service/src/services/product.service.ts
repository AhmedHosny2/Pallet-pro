import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductInterface } from '../interfaces/product.interface/product.interface.interface';
import { Kafka, Partitioners, logLevel } from 'kafkajs';
import { log } from 'console';
import e from 'express';
import { ViewAllProductsDto } from '../dtos/view-all-products.dto';
import { RentProductDto } from 'src/dtos/rent-product.dto';
import { RateProductDto } from 'src/dtos/rateProductDto.dto';
import { WishlistDto } from 'src/dtos/wishlistDto.dto';
@Injectable()
export class ProductService {
  private kafka: Kafka;
  private producer;
  private consumer;
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductInterface>,
  ) {
    this.kafka = new Kafka({
      clientId: 'product-service',
      brokers: ['localhost:9092'],
    });
    this.producer = this.kafka.producer({});
    this.consumer = this.kafka.consumer({ groupId: 'product-service-group' });
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
    await this.consumer.subscribe({ topic: 'view_all_products' });
    await this.consumer.subscribe({ topic: 'view_product' });
    await this.consumer.subscribe({ topic: 'rent_product' });
    await this.consumer.subscribe({ topic: 'rate_product' });

    // comma and add here others
    console.log(
      'Consumer subscribed to topics: view_all_products, view_product, rent_product, rate_product',
    );

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('Consumer running');

        switch (topic) {
          case 'view_all_products':
            console.log(
              'All products here kafka:',
              JSON.parse(message.value.toString()),
            );
            break;
          case 'view_product':
            console.log('product:', JSON.parse(message.value.toString()));
            break;
          case 'rent_product':
            await this.rentProduct(
              JSON.parse(message.value.toString()).id,
              JSON.parse(message.value.toString()).rentProductDto,
            );
            console.log(
              'product rented:',
              JSON.parse(message.value.toString()),
            );
            break;
          case 'rate_product':
            await this.rateProduct(
              JSON.parse(message.value.toString()).id,
              JSON.parse(message.value.toString()).rateProductDto,
            );
            console.log('product rated:', JSON.parse(message.value.toString()));
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
  private async produceEvent(topic: string, value: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(value) }],
    });
  }
  // view all products
  async getAllProducts() {
    console.log('Getting all products');

    const products = await this.productModel.find().exec();
    console.log('All products:', products);
    await this.produceEvent('view_all_products', { products });
    return products;
  }
  async rateProduct(id: string, rateProductDto: RateProductDto) {
    console.log('Rating a product');
    const product = await this.productModel.findById(id).exec();
    console.log('Product:', product);
    // push in ratting list
    product.ratingList.push({
      rating: rateProductDto.rating,
      review: rateProductDto.review,
      userId: rateProductDto.userId,
    });
    await product.save();
    console.log('Product rated:', product);
    return product;
  }

  async createProduct(createProductDto: CreateProductDto) {
    console.log('Creating a product');
    const product = new this.productModel(createProductDto);
    await product.save();
    console.log('Product created:', product);
    return product;
  }
  async getProductById(id: string) {
    console.log('Getting product by id:', id);
    const product = await this.productModel.findById(id).exec();
    console.log('Product:', product);
    await this.produceEvent('view_product', { product });
    return product;
  }
  async rentProduct(id: string, rentProductDto: RentProductDto) {
    console.log('Renting a product');
    const product = await this.productModel.findById(id).exec();
    console.log('Product:', product);
    if (Number(product.stock) < rentProductDto.quantity) {
      throw new Error('Not enough stock');
    }
    product.stock = (
      Number(product.stock) - rentProductDto.quantity
    ).toString(); // Convert to string

    // add data to rent array
    let renter = 1;
    product.rentList.push({
      quantity: rentProductDto.quantity,
      rentDate: rentProductDto.rentDate,
      returnDate: rentProductDto.returnDate,
      renter: renter.toString(),
    });
    await product.save();
    console.log('Product rented:', product);
    return product;
  }
  // product will produce an event to the kafka broker to add a product to user wishlist over topic 
  async addToWishlist(wishlistDto: WishlistDto) {
    console.log('Adding to wishlist');
    await this.produceEvent('add_to_wishlist', wishlistDto);
    console.log('Added to wishlist:', wishlistDto);
    return wishlistDto;
  }
  
}
