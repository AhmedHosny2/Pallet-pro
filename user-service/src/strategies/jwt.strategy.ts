import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'src/services/auth.service';
import { Injectable } from '@nestjs/common';
import { LoginDto } from 'src/dtos/login.dto';
import { UnauthorizedException } from '@nestjs/common';

// Added this
type JwtPayload = {
    sub: string;
    email: string;
}
// Hmmmmm

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(private readonly authService: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'Darwizzy',
        });
    }

    // async validate(payload: any):Promise<any>{
    //     console.log(payload);
    //     return payload;
    // }

    // lama nshoof el extra part deh
     async validate(payload: JwtPayload){
        return payload;
     }
     

}