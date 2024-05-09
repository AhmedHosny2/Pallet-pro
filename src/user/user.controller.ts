import { Controller, Request,Get, Inject, OnModuleInit, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller('user')
export class UserController implements OnModuleInit {

    constructor(private userServices:UserService,
        @Inject('USER_SERVICE') private readonly userClient:ClientKafka){}
   

    @Get('hello')
    async getHello(@Request()req){
        console.log('hello from api');
        console.log(await this.userServices.hello().closed);
        return "Hai";
    }

    @Post('register')
    async regster(@Request()req){
        return this.userServices.register({body:req.body.data});
    }

    @Post('login')
    async login(@Request()req){
        return this.userServices.login({body:req.body.data});
    }

    onModuleInit() {
        this.userClient.subscribeToResponseOf('hello');
        this.userClient.subscribeToResponseOf('register');
        this.userClient.subscribeToResponseOf('login');
    }

}
