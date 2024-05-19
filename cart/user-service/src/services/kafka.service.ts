// import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// import { Kafka, Producer } from 'kafkajs';

// @Injectable()
// export class KafkaService implements OnModuleInit, OnModuleDestroy {
//   private kafka: Kafka;
//   private producer: Producer;

//   constructor() {
//     this.kafka = new Kafka({
//       clientId: 'user-service',
//       brokers: ['localhost:9092'],
//     });
//     this.producer = this.kafka.producer();
//   }

//   async onModuleInit() {
//     await this.producer.connect();
//   }

//   async onModuleDestroy() {
//     await this.producer.disconnect();
//   }

//   async produceEvent(topic: string, value: any) {
//     await this.producer.send({
//       topic,
//       messages: [{ value: JSON.stringify(value) }],
//     });
//   }
// }
