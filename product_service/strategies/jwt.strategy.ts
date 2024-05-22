import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { AuthService } from 'src/services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'Darwizzy', // directly use the secret key
    });
  }

  async validate(payload: any) {
    console.log('Payload', payload);
    return { userId: payload.sub, email: payload.email }; // Include email in the payload
  }
}
