import { Controller, Get, Post, Body, Req, Res, HttpStatus, UseGuards, Param, Delete } from '@nestjs/common';
import { RegisterDTO } from '../dtos/register.dto';
import { User } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { Response } from 'express';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { VerifyEmailDto } from 'src/dtos/verify-email.dto';
import { RateProductDto } from 'src/dtos/rateProductDto.dto';
import { WishlistDto } from 'src/dtos/wishlistDto.dto';

@Controller('auth') // kolohom hayob2o b /auth/...
export class AuthController {
  constructor(
    private readonly authService: AuthService, // so that we can use the methods from the AuthService class
  ) {}

  @Post('register') // hena hatob2a b /auth/register
  async register(@Body() registerDto: RegisterDTO): Promise<User> {
    return await this.authService.register(registerDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<{ message: string }> {
    try {
      const { email, verificationCode } = verifyEmailDto;
      const user = await this.authService.verifyEmail(email, verificationCode);
      return { message: 'Email verified successfully. You can now log in.' };
  } catch (error) {
      return { message: error.message };
  }
  }

  @Post('login') // hena hatob2a b /auth/login
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> { //to be done: change this to jwt token instead of session id
 //   const { token } = await this.authService.login(loginDto);
  //  return { token };
  return this.authService.login(loginDto);
  }

  // @UseGuards(AccessTokenGuard)
  // @Get('logout') // hena hatob2a b /auth/logout
  // async logout(@Req() req: any): Promise<any> {
  //   req.session = null;
  //   this.authService.logout(req.user['sub']);
  // }

  
  @Post('reset-password')
async resetPassword(
  @Body() resetPasswordDto: ResetPasswordDto
): Promise<{ message: string }> {
  try {
    // Generate reset code and send email
    const resetCode = await this.authService.generateResetCode(resetPasswordDto.email);
    return { message: 'Reset code sent to your email' };
  } catch (error) {
    return { message: error.message };
  }
}

@Post('reset-password/confirm')
async resetPasswordConfirm(
  @Body() resetPasswordDto: ResetPasswordDto
): Promise<{ message: string }> {
  try {
    // Reset password
    await this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.resetCode,
      resetPasswordDto.newPassword
    );
    return { message: 'Password reset successfully' };
  } catch (error) {
    return { message: error.message };
  }
}

@Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    try {
      console.log('before const token in google/callback')
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw new Error('Authorization header is missing');
      }
      const token = req.headers.authorization.split(' ')[1]; // Extract token from authorization header
      console.log('after const token:', token);
      const { token: authToken } = await this.authService.googleLogin(token); // Pass the token to the authService method
      console.log('after const authToken:', authToken)
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.redirect('/error');
    }
  }
  @Post('rate/:id')
  async rateProduct(@Body() rateProductDto: RateProductDto, @Param
  ('id') id: string
  ): Promise<any> {
    return this.authService.rateProduct(rateProductDto, id);
  }
  // the flow is 
  // form the frontends once user click add to wishlist  we will get product data then send it to user 
  // user then add it to the DB 
  @Post('add-to-wishlist')
  async addToWishlist(@Body() wishlistDto: WishlistDto, @Param('id') id: string): Promise<any> {
    return this.authService.addToWishlist(wishlistDto);

  }
@Get('wishlist')
async getWishlist(@Body() data:string): Promise<any> {
  return this.authService.getWishlist(data);

}
@Delete('wishlist/:id')
async deleteWishlist(@Param('id') id: string, @Body() data:any): Promise<any> {
  let {email}= data
  return this.authService.deleteWishlist(id,email);
}


  
}

/*
  The controller defines endpoints (routes) for the application and specifies the CRUD operations that can be performed on the user data.
  It handles incoming requests, processes them, and sends back the appropriate responses.
*/
