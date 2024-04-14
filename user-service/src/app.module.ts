import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseProviders } from './database.providers';
import { UserSchema } from './schemas/user.schema';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { identityProviders } from './identity.providers';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ // the modules that will be imported, we will use MongooseModule to connect to the MongoDB database
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb+srv://test:test@cluster0.lvfdivg.mongodb.net/',
      }),
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // the models that will be used in this module
    PassportModule,
    JwtModule.register({
      secret: 'Darwizzy',
      signOptions: { expiresIn: '60s' },
    })
  ],
  controllers: [AuthController], // to handle requests and responses, they define the routes and the corresponding HTTP request methods
  providers: [AuthService, ...identityProviders, ...databaseProviders], // to define components within the application that can be injected into other components
  exports: [...databaseProviders] // which providers should be available to other modules to import
})
export class AppModule {}
