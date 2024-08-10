import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseProviders } from './database.providers';
import { UserSchema } from './schemas/user.schema';
import { AddressSchema } from './schemas/address.schema';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { identityProviders } from './identity.providers';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { ProductsController } from './controllers/products.controller';
import { ProductService } from './services/product.service';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import * as session from 'express-session';
import { SessionMiddleware } from './session.middleware';
import { OrdersController } from './controllers/orders.controller';
import { OrderService } from './services/order.service';

@Module({
  imports: [ // the modules that will be imported, we will use MongooseModule to connect to the MongoDB database
    ClientsModule.register([
      { name: 'CART_SERVICE', transport: Transport.KAFKA, 
      options: { client: { brokers: ['kafka:9092'], clientId: 'cart-service' } , consumer: { groupId: 'cart-service-group' }}},
    ]),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: "mongodb+srv://admin:ma82345678omm@cluster0.ynli9r8.mongodb.net/",
      }),
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'Address', schema: AddressSchema }]), // the models that will be used in this module
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'Darwizzy',
      signOptions: { expiresIn: '60m' },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: "DarwinsAgents@gmail.com",
          pass: "mombjfhrqmlofkdj",
        },
        authMethod: 'LOGIN'
      },
      defaults: {
        from: env.GMAIL_USER, 
      },
    }),
   // JwtModule.register({})
  ],
  controllers: [AuthController, CartController, ProductsController, ProfileController, OrdersController], // to handle requests and responses, they define the routes and the corresponding HTTP request methods
  providers: [AuthService, ...identityProviders, ...databaseProviders,JwtModule, LocalStrategy,JwtStrategy, CartService, ProfileService, ProductService, OrderService], // to define components within the application that can be injected into other components
  exports: [...databaseProviders] // which providers should be available to other modules to import
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: 'Liverpool',
          resave: false,
          saveUninitialized: false,
          cookie: { maxAge: 3600000 }, // 1 hour
        }),
        SessionMiddleware
      )
      .forRoutes('*'); // Apply to all routes 
  }
}