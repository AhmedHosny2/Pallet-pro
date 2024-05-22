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
const uri ="mongodb+srv://admin:ma82345678omm@cluster0.ynli9r8.mongodb.net/"
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'strategies/jwt.strategy';
@Module({
  imports: [MongooseModule.forRootAsync({
    useFactory: () => ({
      uri,
    }),
  }),
  MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: 'Darwizzy',
    signOptions: { expiresIn: '60m' },
  }),],
 
  controllers: [AppController, ProductServiceController],
  providers: [ProductService,AppService,...identityProviders, ...databaseProviders,JwtModule,JwtStrategy,ProductService],
  exports: [...databaseProviders] // which providers should be available to other modules to import


})
export class AppModule {}
