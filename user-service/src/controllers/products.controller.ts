import { Controller, Post, Get, Put, Body, Delete, Req, HttpStatus, UseGuards, Param, Res } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { AddressDTO } from '../dtos/address.dto';
import { Address } from '../interfaces/address.interface';
import { Request } from 'express';
import { RateProductDto } from 'src/dtos/rateProductDto.dto';
import { ProductService } from 'src/services/product.service';
import { WishlistDto } from 'src/dtos/wishlistDto.dto';
import { JwtAuthGuard } from 'src/strategies/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductService,
  ) {}
  
  @Post('rate/:id')
  @UseGuards(JwtAuthGuard)
  async rateProduct(@Body() rateProductDto: RateProductDto, @Param
    ('id') id: string
  ): Promise<any> {
    return this.productService.rateProduct(rateProductDto, id);
  }
  
  @Get('wishlist')
  @UseGuards(JwtAuthGuard)
  async getWishlist(@Body() data: string): Promise<any> {
    return this.productService.getWishlist(data);
  }
  
  @Post('add-to-wishlist')
  @UseGuards(JwtAuthGuard)
  async addToWishlist(@Body() wishlistDto: WishlistDto, @Param('id') id: string): Promise<any> {
    return this.productService.addToWishlist(wishlistDto);
  }

  @Delete('wishlist/:id')
  @UseGuards(JwtAuthGuard)
  async deleteWishlist(@Param('id') id: string, @Body() data: any): Promise<any> {
    let { email } = data
    return this.productService.deleteWishlist(id, email);
  }
}