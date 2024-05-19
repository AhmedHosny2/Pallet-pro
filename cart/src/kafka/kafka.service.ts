import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;
  private handlers: { [topic: string]: (payload: any) => Promise<void> } = {};

  constructor() {
    this.kafka = new Kafka({
      clientId: 'cart-service',
      brokers: ['localhost:9092'],
    });
    this.consumer = this.kafka.consumer({ groupId: 'cart-service-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, message } = payload;
        const parsedMessage = JSON.parse(message.value.toString());
        console.log('Parsed message:', parsedMessage);
        const handler = this.handlers[topic];
        if (handler) {
          await handler(parsedMessage);
        }
      },
    });
    
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }

  async consume(topic: string, handler: (payload: any) => Promise<void>) {
    this.handlers[topic] = handler;
    await this.consumer.subscribe({ topic });
  }
}
