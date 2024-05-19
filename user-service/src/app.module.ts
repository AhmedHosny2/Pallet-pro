import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseProviders } from './database.providers';
import { UserSchema } from './schemas/user.schema';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { identityProviders } from './identity.providers';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import {MailerModule} from '@nestjs-modules/mailer';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';

@Module({
  imports: [ // the modules that will be imported, we will use MongooseModule to connect to the MongoDB database
    ClientsModule.register([
      { name: 'CART_SERVICE', transport: Transport.KAFKA, 
      options: { client: { brokers: ['localhost:9092'], clientId: 'cart-service' } , consumer: { groupId: 'cart-service-group' }}},
    ]),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: env.MONGODB_URI,
      }),
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // the models that will be used in this module
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'Darwizzy',
      signOptions: { expiresIn: '60s' },
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
  controllers: [AuthController, CartController], // to handle requests and responses, they define the routes and the corresponding HTTP request methods
  providers: [AuthService, ...identityProviders, ...databaseProviders,JwtModule, LocalStrategy,JwtStrategy, CartService],  // to define components within the application that can be injected into other components
  exports: [...databaseProviders] // which providers should be available to other modules to import
})
export class AppModule {}