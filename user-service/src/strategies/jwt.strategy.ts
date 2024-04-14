import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'src/services/auth.service';
import { Injectable } from '@nestjs/common';
import { LoginDto } from 'src/dtos/login.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'local'){
    constructor(private readonly authService: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'Darwizzy',
        });
    }

    async validate(payload: any):Promise<any>{
        console.log(payload);
        return payload;
    }

}
