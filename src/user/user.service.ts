import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class UserService {
    constructor(@Inject('USER_SERVICE') private readonly userClient:ClientKafka){}


    public hello(){
        return this.userClient.send('hello','t').subscribe((data)=>console.log("works lol"));
    }
    public register(command){
        return this.userClient.send('register',command).subscribe((data)=>console.log(command.data));
    }
    public login(command){
        return this.userClient.send('login',command).subscribe((data)=>console.log(command.data));
    }
}
