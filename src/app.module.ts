import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductServiceController } from './controllers/product-service.controller';

@Module({
  imports: [],
  controllers: [AppController, ProductServiceController],
  providers: [AppService],
})
export class AppModule {}
