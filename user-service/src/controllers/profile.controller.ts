import { Controller, Post, Get, Put, Body, Delete, Res, HttpStatus } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDTO } from '../dtos/updateProfile.dto';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) {}

  @Get('hello')
  getHello(): any {
    console.log('hello from profile');
    return { message: 'Hello from profile microservice' };
  }

  @Get('profile')
  async getProfile(): Promise<User> {
    const token = "Token"; // to be done: get token from request header
    return this.profileService.getProfile(token);
  }

  @Put('profile')
  async updateProfile(@Body() updateProfileDTO: UpdateProfileDTO): Promise<User> { //email confirmation?
    const token = "Token"; // to be done: get token from request header
    return this.profileService.updateProfile(token, updateProfileDTO);
  }

  @Delete('profile')
  async deleteProfile(): Promise<User> {
    const token = "Token"; // to be done: get token from request header
    return this.profileService.deleteProfile(token);
  }
  
}

/*
  The controller defines endpoints (routes) for the application and specifies the CRUD operations that can be performed on the user data.
  It handles incoming requests, processes them, and sends back the appropriate responses.
*/
