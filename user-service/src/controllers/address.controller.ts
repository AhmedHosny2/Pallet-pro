import { Controller, Post, Get, Put, Body, Delete, Req, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { AddressService } from '../services/address.service';
import { AddressDTO } from '../dtos/address.dto';
import { Address } from '../interfaces/address.interface';
import { JwtAuthGuard } from 'src/strategies/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly addressSevice: AddressService,
  ) {}

  @Get('allAddresses')
  @UseGuards(JwtAuthGuard)
  async getAllAddresses(@Request() req): Promise<any> {
    const userId = req.user?.userId;
    // return this.addressSevice.getAllAddresses(user_id);
    return "All Addresses";
  }

  @Put('updateAddress')
  @UseGuards(JwtAuthGuard)
  async updateAddress(@Request() req, @Body() addressDTO: AddressDTO): Promise<any> { //email confirmation?
    const userId = req.user?.userId;
    return this.addressSevice.updateAddress(userId, addressDTO.id, addressDTO);
  }

  @Delete('deleteAddress')
  @UseGuards(JwtAuthGuard)
  async deleteAddress(@Request() req, @Body() addressDTO: AddressDTO): Promise<any> {
    const userId = req.user?.userId;
    return this.addressSevice.deleteAddress(userId, addressDTO.id);
  }

  @Post('createAddress')
  @UseGuards(JwtAuthGuard)
  async createAddress(@Request() req, @Body() addressDTO: AddressDTO): Promise<any> {
    const userId = req.user?.userId;
    return this.addressSevice.createAddress(userId, addressDTO);
  }

  @Get('getUserAddress')
  @UseGuards(JwtAuthGuard)
  async getUserAddress(@Request() req): Promise<any> {
    const userId = req.user?.userId;
    return this.addressSevice.getSelectedAddress(userId);
  }
}

/*
  The controller defines endpoints (routes) for the application and specifies the CRUD operations that can be performed on the user data.
  It handles incoming requests, processes them, and sends back the appropriate responses.
*/
