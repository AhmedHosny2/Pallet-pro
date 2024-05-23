import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductInterface } from 'src/interfaces/product.interface/product.interface.interface';
import { Kafka, Partitioners, logLevel } from 'kafkajs';
import { ViewAllProductsDto } from '../dtos/view-all-products.dto';
import { RentProductDto } from 'src/dtos/rent-product.dto';
import { RateProductDto } from 'src/dtos/rateProductDto.dto';
import { WishlistDto } from 'src/dtos/wishlistDto.dto';

@Injectable()
export class ProductService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer;
  private consumer;
  private isConsumerStarted = false;

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
    if (!this.isConsumerStarted) {
      await this.startConsumer();
      this.isConsumerStarted = true;
    }
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
    await this.consumer.subscribe({ topic: 'get_product_details' });

    console.log('Consumer subscribed to topics: view_all_products, view_product, rent_product, rate_product');

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('Consumer running');

        const messageValue = JSON.parse(message.value.toString());

        switch (topic) {
          case 'view_all_products':
            console.log('All products here kafka:', messageValue);
            break;
          case 'view_product':
            console.log('Product:', messageValue);
            break;
          case 'rent_product':
            await this.rentProduct(messageValue.id, messageValue.rentProductDto);
            console.log('Product rented:', messageValue);
            break;
          case 'rate_product':
            await this.rateProduct(messageValue.id, messageValue.rateProductDto);
            console.log('Product rated:', messageValue);
            break;
          case 'get_product_details':
            const { productId, correlationId } = messageValue;
            const product = await this.getProductById(productId);
            await this.produceEvent('product_details_response', { correlationId, product });
            break;
          default:
            console.log('Unknown event:', topic);
            break;
        }
      },
    });
  }

  private async produceEvent(topic: string, value: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(value) }],
    });
  }

  // View all products
  async getAllProducts() {
    console.log('Getting all products');
    const products = await this.productModel.find().exec();
    console.log('All products:', products);
    return products;
  }

  async rateProduct(id: string, rateProductDto: RateProductDto) {
    console.log('Rating a product');
    const product = await this.productModel.findById(id).exec();
    console.log('Product:', product);
    product.ratingList.push({
      rating: rateProductDto.rating,
      review: rateProductDto.review,
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
    return product;
  }

  async rentProduct(id: string, rentProductDto: RentProductDto) {
    console.log('Renting a product');
    const product = await this.productModel.findById(id).exec();
    console.log('Product:', product);
    if (Number(product.stock) < rentProductDto.quantity) {
      throw new Error('Not enough stock');
    }
    product.stock = (Number(product.stock) - rentProductDto.quantity).toString();
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
}

