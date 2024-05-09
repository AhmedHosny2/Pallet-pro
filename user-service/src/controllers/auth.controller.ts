import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { RegisterDTO } from '../dtos/register.dto';
import { User } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { Response } from 'express';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@Controller('auth') // kolohom hayob2o b /auth/...
export class AuthController {
  constructor(
    private readonly authService: AuthService, // so that we can use the methods from the AuthService class
  ) {}

  @Post('register') // hena hatob2a b /auth/register
  async register(@Body() registerDto: RegisterDTO): Promise<User> {
    return this.authService.register(registerDto);
  }

  @Post('login') // hena hatob2a b /auth/login
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> { //to be done: change this to jwt token instead of session id
    const { token } = await this.authService.login(loginDto);
    return { token };
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
  }

/*
  The controller defines endpoints (routes) for the application and specifies the CRUD operations that can be performed on the user data.
  It handles incoming requests, processes them, and sends back the appropriate responses.
*/
