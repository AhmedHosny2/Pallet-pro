import { Controller, Post, Get, Put, Body, Delete, Req, HttpStatus } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { AddressService } from '../services/address.service';
import { AddressDTO } from '../dtos/address.dto';
import { Address } from '../interfaces/address.interface';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly addressSevice: AddressService,
  ) {}

  @Get('hello')
  getHello(): any {
    console.log('hello from profile');
    return { message: 'Hello from profile microservice' };
  }

  @Get('allAddresses')
  async getAllAddresses(@Req() req: Request): Promise<any> {
    const user_id = "Token"; // to be done: get token from request header
    // return this.addressSevice.getAllAddresses(user_id);
    return "All Addresses";
  }

  @Put('updateAddress')
  async updateAddress(@Body() addressDTO: AddressDTO): Promise<any> { //email confirmation?
    const user_id = "Token"; // to be done: get token from request header
    return this.addressSevice.updateAddress(user_id, addressDTO.id, addressDTO);
  }

  @Delete('deleteAddress')
  async deleteAddress(@Body() addressDTO: AddressDTO): Promise<any> {
    const user_id = "Token"; // to be done: get token from request header
    return this.addressSevice.deleteAddress(user_id, addressDTO.id);
  }

  @Post('createAddress')
  async createAddress(@Body() addressDTO: AddressDTO): Promise<any> {
    const user = "Token"; // to be done: get token from request header
    return this.addressSevice.createAddress(user, addressDTO);
  }

  @Get('getUserAddress')
  async getUserAddress(): Promise<any> {
    const user_id = "Token"; // to be done: get token from request header
    return this.addressSevice.getSelectedAddress(user_id);
  }
}

/*
  The controller defines endpoints (routes) for the application and specifies the CRUD operations that can be performed on the user data.
  It handles incoming requests, processes them, and sends back the appropriate responses.
*/
