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
import {GoogleStrategy} from './strategies/google.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { JWT } from 'google-auth-library';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Module({
  imports: [ // the modules that will be imported, we will use MongooseModule to connect to the MongoDB database
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
  controllers: [AuthController], // to handle requests and responses, they define the routes and the corresponding HTTP request methods
  providers: [AuthService, ...identityProviders, ...databaseProviders, GoogleStrategy, RefreshTokenStrategy, AccessTokenGuard, GoogleAuthGuard, JwtModule], // to define components within the application that can be injected into other components
  exports: [...databaseProviders] // which providers should be available to other modules to import
})
export class AppModule {}