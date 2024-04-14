import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from '../services/auth.service';
import {LoginDto} from '../dtos/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){

    constructor(private readonly authService: AuthService){
        super();
    }

    async validate(email:string , password:string): Promise<any>{
        console.log('validate:', email, password);

        var loginDto: LoginDto = {
            email: email,
            password: password
        }

        const user = await this.authService.login(loginDto);

        if(!user){
            throw new UnauthorizedException();
        }

        console.log('validated user:', user);
        return user;
    }
}