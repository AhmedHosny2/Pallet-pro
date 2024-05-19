import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // Use email as the username field
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('LocalStrategy.validate');
    const user = await this.authService.validateUser(email, password);
    console.log('LocalStrategy.validate user:', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
