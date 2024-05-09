import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name:'USER_SERVICE',
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:'user',
            brokers:['localhost:9092']
          },
          consumer:{
            groupId:'user-consumer',
          }
        }
      }
    ]),UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
