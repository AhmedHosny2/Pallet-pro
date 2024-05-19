import { Controller, Post, Get, Put, Delete, Body, Req, UseGuards, Request, OnModuleInit } from '@nestjs/common';
import { JwtAuthGuard } from 'src/strategies/jwt-auth.guard';
import { CartService } from 'src/services/cart.service';
import { ClientKafka } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';


@Controller('cart')
export class CartController implements OnModuleInit{
  constructor(
    private readonly cartService: CartService,
    @Inject ('CART_SERVICE') private readonly cartClient: ClientKafka
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addToCart(@Request() req, @Body() addToCartDto) {
    const userId = req.user?.userId || req.body.guestId || await this.createGuestCart();
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@Request() req) {
    const userId = req.user?.userId || req.query.guestId;
    return this.cartService.getCart(userId);}

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateCart(@Request() req, @Body() updateCartDto) {
    const userId = req.user?.userId || req.body.guestId;
    return this.cartService.updateCart(userId, updateCartDto);}

  @UseGuards(JwtAuthGuard)
  @Delete('remove')
  async removeFromCart(@Request() req, @Body() removeFromCartDto) {
    const userId = req.user?.userId || req.body.guestId;
    return this.cartService.removeFromCart(userId, removeFromCartDto);}

  @Post('apply-coupon')
  async applyCoupon(@Request() req, @Body() applyCouponDto) {
    const userId = req.user?.userId || req.body.guestId;
    return this.cartService.applyCoupon(userId, applyCouponDto);}

  @Post('convert-cart')
  async convertCart(@Body() convertCartDto) {
    const { guestId, userId } = convertCartDto;
    return this.cartService.convertCart(guestId, userId);}

  private async createGuestCart(): Promise<string> {
    const guestId = 'guest_' + Math.random().toString(36).substring(2, 15);
    await this.cartService.createCart(guestId);
    return guestId;
  }

  async onModuleInit() {
    this.cartClient.subscribeToResponseOf('cart_add');
    this.cartClient.subscribeToResponseOf('cart_get');
    this.cartClient.subscribeToResponseOf('cart_update');
    this.cartClient.subscribeToResponseOf('cart_remove');
    this.cartClient.subscribeToResponseOf('cart_apply_coupon');
    this.cartClient.subscribeToResponseOf('cart_convert');
    this.cartClient.subscribeToResponseOf('cart_create');
    await this.cartClient.connect();
  }
}


// import { Controller, Post, Get, Put, Delete, Body, Req, UseGuards, Request } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/strategies/jwt-auth.guard';
// import { CartService } from '../services/cart.service';

// @Controller('cart')
// export class CartController {
//   constructor(private readonly cartService: CartService) {}

//   @UseGuards(JwtAuthGuard)
//   @Post('add')
//   async addToCart(@Request() req, @Body() addToCartDto) {
//     const userId = req.user.userId;
//     return this.cartService.addToCart(userId, addToCartDto);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get()
//   async getCart(@Request() req) {
//     const userId = req.user.userId;
//     return this.cartService.getCart(userId);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Put('update')
//   async updateCart(@Request() req, @Body() updateCartDto) {
//     const userId = req.user.userId;
//     return this.cartService.updateCart(userId, updateCartDto);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Delete('remove')
//   async removeFromCart(@Request() req, @Body() removeFromCartDto) {
//     const userId = req.user.userId;
//     return this.cartService.removeFromCart(userId, removeFromCartDto);
//   }
// }
