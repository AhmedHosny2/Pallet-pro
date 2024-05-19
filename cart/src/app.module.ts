import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './cart.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    KafkaModule],
  controllers: [CartController],
  providers: [CartService],
})
export class AppModule {}
