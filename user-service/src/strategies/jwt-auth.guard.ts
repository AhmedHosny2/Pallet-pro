import { ExecutionContext, Injectable, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // setting the authorization header in the request to the authorization header in the cookie
        if (context.switchToHttp().getRequest().headers.authorization === undefined)
            try {
            context.switchToHttp().getRequest().headers.authorization = context.switchToHttp().getRequest().headers.cookie.split('Authorization')[1].split(';')[0].split('=')[1].split('%20').join(' ');
            } catch (error) {
                console.log('Error setting authorization header in request', error);
            }
        
        return super.canActivate(context);
    }

}
