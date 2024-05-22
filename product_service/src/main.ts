import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ProductService} from"./services/product.service"
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const authService = app.get(ProductService);
  //await authService.startConsumer();
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(3002);
}
bootstrap();
