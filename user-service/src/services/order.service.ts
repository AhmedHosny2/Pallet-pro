import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from '../interfaces/user.interface';
import { Kafka } from 'kafkajs';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
// 

@Injectable()
export class OrderService {
    private kafka: Kafka;
    private producer;
    private consumer;
    constructor(
      private jwtService: JwtService,
      
    private readonly mailerService: MailerService,
      @InjectModel('User') private readonly userModel: Model<User>
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
      
      await this.consumer.subscribe({ topic: 'create_order' });
      await this.consumer.subscribe({ topic: 'get_all_orders' });
      await this.consumer.subscribe({ topic: 'get_order' });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          switch (topic) {
                case 'create_order':
                    const { order } = JSON.parse(message.value.toString());
                    break;
                case 'get_all_orders':
                    break;
                case 'get_order':
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

    async createOrder(userId, order): Promise<any> {
      try {
        console.log('Creating order:', order, userId);
        const user = await this.userModel.findById(userId);
        if (!user) {
          throw new HttpException('User not found', 404);
        }
        user.orders.push(order);
        const content = "<p>Your order with price " + order.price + "</p>";
        await this.mailerService.sendMail({
          to: user.email,
          subject: "Order Confirmation",
          html: content,
        });
        await user.save();
        return order;
      } catch (error) {
        throw new HttpException(error, 500);
      }
    }

    async getAllOrders(userId): Promise<any> {
      console.log('Getting all orders for user:', userId);
      
      try {
        console.log('Getting all orders for user:', userId);
        
        const user = await this.userModel.findById(userId);
        console.log('User:', user);
        
        if (!user) {
          throw new HttpException('User not found', 404);
        }
        console.log('Orders: lwehrlwehrl  \n\n\n', user.orders);
        return user.orders;
      } catch (error) {
        throw new HttpException(error, 500);
      }
    }

    async getOrder(userId, orderId): Promise<any> {
      try {
        const user = await this.userModel.findById(userId);
        if (!user) {
          throw new HttpException('User not found', 404);
        }
        const order = user.orders.find(order => order.id == orderId);
        if (!order) {
          throw new HttpException('Order not found', 404);
        }
        console.log("my orer /n/n/n/n\n\n\n\n" + order);
        
        return order;
      } catch (error) {
        throw new HttpException(error, 500);
      }
    }


}