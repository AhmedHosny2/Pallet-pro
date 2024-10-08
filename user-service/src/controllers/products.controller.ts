import { Controller, Post, Get, Put, Body, Delete, Req, HttpStatus, UseGuards, Param, Res, Request } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { AddressDTO } from '../dtos/address.dto';
import { Address } from '../interfaces/address.interface';
import { RateProductDto } from 'src/dtos/rateProductDto.dto';
import { ProductService } from 'src/services/product.service';
import { JwtAuthGuard } from 'src/strategies/jwt-auth.guard';
import { CreateWishlistDTO } from 'src/dtos/wishlistCreate.dto';
import { AddToWishlistDTO } from 'src/dtos/wishListAdd';
import { RemoveFromWishlistDTO } from 'src/dtos/wishlistRemove.dto';
import { DeleteWishlistDTO } from 'src/dtos/wishlistDelete';
import { GetWishlistDTO } from 'src/dtos/wishlistGet';
import {FavDTO} from "src/dtos/fav.dto"
import {deleteFavDTO} from "src/dtos/deleteFavDTO.dto"
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
  async getWishlist(@Request() req, @Body() getWishlistDTO: GetWishlistDTO): Promise<any> {
    console.log('getWishlistDTO:', getWishlistDTO);
    const userId = req.user?.userId;
    return this.productService.getWishlist(userId, getWishlistDTO);
  }
  
  @Post('wishlist')
  @UseGuards(JwtAuthGuard)
  async createWishlist(@Request() req, @Body() createWishlistDTO: CreateWishlistDTO): Promise<any> {
    console.log('createWishlistDTO:', createWishlistDTO);
    const userId = req.user?.userId;
    return this.productService.createWishlist(userId, createWishlistDTO);
  }

  @Put('wishlist/add')
  @UseGuards(JwtAuthGuard)
  async addToWishlist(@Request() req, @Body() addToWishlistDTO: AddToWishlistDTO): Promise<any> {
    console.log('addToWishlistDTO:', addToWishlistDTO);
    const userId = req.user?.userId;
    return this.productService.addToWishlist(userId, addToWishlistDTO);
  }

  @Put('wishlist/remove')
  @UseGuards(JwtAuthGuard)
  async removeFromWishlist(@Request() req, @Body() removeFromWishlistDTO: RemoveFromWishlistDTO): Promise<any> {
    console.log('removeFromWishlistDTO:', removeFromWishlistDTO);
    const userId = req.user?.userId;
    return this.productService.removeFromWishlist(userId, removeFromWishlistDTO);
  }

  @Delete('wishlist')
  @UseGuards(JwtAuthGuard)
  async deleteWishlist(@Request() req, @Body() deleteWishlistDTO: DeleteWishlistDTO): Promise<any> {
    console.log('deleteWishlistDTO:', deleteWishlistDTO);
    const userId = req.user?.userId;
    return this.productService.deleteWishlist(userId, deleteWishlistDTO);
  }

  @Get('allWishlists')
  @UseGuards(JwtAuthGuard)
  async getAllWishlist(@Request() req): Promise<any> {
    const userId = req.user?.userId;
    return this.productService.getAllWishlists(userId);
  }
  @Get('getAllFavorites')
  @UseGuards(JwtAuthGuard)
  async getAllFav(@Request() req): Promise<any> {
    const userId = req.user?.userId;
    return this.productService.getAllFavs(userId);
  }
// post fav
@Post('fav')
@UseGuards(JwtAuthGuard)
async postFav(@Request() req, @Body() favDTo: FavDTO): Promise<any> {
  const userId = req.user?.userId;
  return this.productService.addFav(userId, favDTo);
}
// delete fav
@Delete('fav')
@UseGuards(JwtAuthGuard)
async deleteFav(@Request() req, @Body() favDTo: deleteFavDTO): Promise<any> {
  const userId = req.user?.userId;
  return this.productService.removeFavorite(userId, favDTo);
}

  
}