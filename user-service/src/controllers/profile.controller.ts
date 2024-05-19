import { Controller, Post, Get, Put, Body, Delete, Res, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDTO } from '../dtos/updateProfile.dto';
import { JwtAuthGuard } from 'src/strategies/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req): Promise<User> {
    const userId = req.user?.userId;
    return this.profileService.getProfile(userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateProfileDTO: UpdateProfileDTO): Promise<User> { //email confirmation?
    const userId = req.user?.userId;
    return this.profileService.updateProfile(userId, updateProfileDTO);
  }

  @Delete('profile')
  @UseGuards(JwtAuthGuard)
  async deleteProfile(@Request() req): Promise<User> {
    const userId = req.user?.userId;
    return this.profileService.deleteProfile(userId);
  }
  
}

/*
  The controller defines endpoints (routes) for the application and specifies the CRUD operations that can be performed on the user data.
  It handles incoming requests, processes them, and sends back the appropriate responses.
*/
