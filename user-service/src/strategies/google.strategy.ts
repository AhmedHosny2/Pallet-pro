import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: '142166430996-t99imiu4efu85ohe2uqaefgd02ea4d7o.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { given_name, family_name, email } = profile._json;
    const user = {
      firstName: given_name,
      lastName: family_name,
      email,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
