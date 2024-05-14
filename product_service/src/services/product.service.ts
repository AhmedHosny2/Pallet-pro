import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductInterface } from '../interfaces/product.interface/product.interface.interface';
import { Kafka, logLevel } from 'kafkajs';
import { log } from 'console';
import e from 'express';
import { ViewAllProductsDto } from '../dtos/view-all-products.dto';

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
    this.producer = this.kafka.producer();
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

    async startConsumer(){

        await this.consumer.subscribe({ topic: 'view_all_products' });
        await this.consumer.subscribe({ topic: 'view_product' });

        // comma and add here others 
        console.log('Consumer subscribed to topics: view_all_products, view_product');

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
              switch (topic) {
                case 'view_all_products':
                  console.log('All products:', JSON.parse(message.value.toString()));
                  break;
                case 'view_product':
                  console.log('product:', JSON.parse(message.value.toString()));
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
        // view all products
        async getAllProducts() {
            console.log('Getting all products');
            ('Getting all products');
            const products = await this.productModel.find().exec();
            console.log('All products:', products);
            await this.producer.send({
              topic: 'view_all_products',
              messages: [{ value: JSON.stringify(products) }],
            });
            return products;
          }

}
