import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductServiceController } from './controllers/product-service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseProviders } from './database.providers';
import { ProductSchema } from './schemas/product.schema/product.schema'
import { ProductService } from './services/product.service';
import { identityProviders } from './identity.providers';
import { env } from 'process';
const uri ="mongodb+srv://user:123@cluster0.m543dzd.mongodb.net/"
@Module({
  imports: [MongooseModule.forRootAsync({
    useFactory: () => ({
      uri,
    }),
  }),
  MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),],
  controllers: [AppController, ProductServiceController],
  providers: [ProductService,AppService,...identityProviders, ...databaseProviders,],
  exports: [...databaseProviders] // which providers should be available to other modules to import

})
export class AppModule {}
