import { Controller, Get, Post, Body, Req, HttpStatus, UseGuards, Param, Request, Response } from '@nestjs/common';
import { Response as Res } from 'express';
import { RegisterDTO } from '../dtos/register.dto';
import { User } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { VerifyEmailDto } from 'src/dtos/verify-email.dto';
import { RateProductDto } from 'src/dtos/rateProductDto.dto';
import { JwtAuthGuard } from 'src/strategies/jwt-auth.guard';
import { MessagePattern } from '@nestjs/microservices';
import { access } from 'fs';

@Controller('auth') // kolohom hayob2o b /auth/...
export class AuthController {
  constructor(
    private readonly authService: AuthService, // so that we can use the methods from the AuthService class
  ) { }

  @Post('register') // hena hatob2a b /auth/register
  async register(@Body() registerDto: RegisterDTO): Promise<User> {
    console.log('registerDto:', registerDto);
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
  async login(@Body() loginDto: LoginDto, @Response() res: Res): Promise<any> { //to be done: change this to jwt token instead of session id
    const user = await this.authService.login(loginDto);
    return res.cookie('Authorization', 'Bearer ' + user.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "localhost",
      expires: new Date(Date.now() + 60 * 60 * 10 * 1000),
    }).json({ token: user.token });
  }
  
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

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}

/*
  The controller defines endpoints (routes) for the application and specifies the CRUD operations that can be performed on the user data.
  It handles incoming requests, processes them, and sends back the appropriate responses.
*/
