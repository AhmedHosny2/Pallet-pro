// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

// @Injectable()
// export class KafkaService implements OnModuleInit, OnModuleDestroy {
//   private kafka: Kafka;
//   private consumer: Consumer;

//   constructor() {
//     this.kafka = new Kafka({
//       clientId: 'cart-service',
//       brokers: ['localhost:9092'],
//     });
//     this.consumer = this.kafka.consumer({ groupId: 'cart-service-group' });
//   }

//   async onModuleInit() {
//     await this.consumer.connect();
//   }

//   async onModuleDestroy() {
//     await this.consumer.disconnect();
//   }

//   async consume(topic: string, handler: (payload: any) => Promise<void>) {
//     await this.consumer.subscribe({ topic });
//     await this.consumer.run({
//       eachMessage: async (payload: EachMessagePayload) => {
//         const message = JSON.parse(payload.message.value.toString());
//         await handler(message);
//       },
//     });
//   }
// }
