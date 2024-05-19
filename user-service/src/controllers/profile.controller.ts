import { Controller, Post, Get, Put, Body, Delete, Res, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { UpdateProfileDTO } from '../dtos/updateProfile.dto';
import { JwtAuthGuard } from 'src/strategies/jwt-auth.guard';
import { ProfileService } from '../services/profile.service';
import { AddressDTO } from 'src/dtos/address.dto';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req): Promise<User> {
    const userId = req.user?.userId;
    return this.profileService.getProfile(userId);
  }

  @Put('')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateProfileDTO: UpdateProfileDTO): Promise<User> { //email confirmation?
    const userId = req.user?.userId;
    return this.profileService.updateProfile(userId, updateProfileDTO);
  }

  @Delete('')
  @UseGuards(JwtAuthGuard)
  async deleteProfile(@Request() req): Promise<User> {
    const userId = req.user?.userId;
    return this.profileService.deleteProfile(userId);
  }

  @Get('allAddresses')
  @UseGuards(JwtAuthGuard)
  async getAllAddresses(@Request() req): Promise<any> {
    const userId = req.user?.userId;
    // return this.addressSevice.getAllAddresses(user_id);
    return this.profileService.getAllAddresses(userId);
  }

  @Put('updateAddress')
  @UseGuards(JwtAuthGuard)
  async updateAddress(@Request() req, @Body() addressDTO: AddressDTO): Promise<any> { //email confirmation?
    const userId = req.user?.userId;
    return this.profileService.updateAddress(userId, addressDTO.id, addressDTO);
  }

  @Delete('deleteAddress')
  @UseGuards(JwtAuthGuard)
  async deleteAddress(@Request() req, @Body() addressDTO: AddressDTO): Promise<any> {
    const userId = req.user?.userId;
    return this.profileService.deleteAddress(userId, addressDTO.id);
  }

  @Post('createAddress')
  @UseGuards(JwtAuthGuard)
  async createAddress(@Request() req, @Body() addressDTO: AddressDTO): Promise<any> {
    const userId = req.user?.userId;
    return this.profileService.createAddress(userId, addressDTO);
  }

  @Get('getUserAddress')
  @UseGuards(JwtAuthGuard)
  async getUserAddress(@Request() req): Promise<any> {
    const userId = req.user?.userId;
    return this.profileService.getSelectedAddress(userId);
  }
  
}

/*
  The controller defines endpoints (routes) for the application and specifies the CRUD operations that can be performed on the user data.
  It handles incoming requests, processes them, and sends back the appropriate responses.
*/
