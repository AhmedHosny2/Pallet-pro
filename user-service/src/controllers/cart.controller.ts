import { Controller, Post, Get, Put, Delete, Body, Req, Request, OnModuleInit } from '@nestjs/common';
import { JwtAuthGuard } from 'src/strategies/jwt-auth.guard';
import { CartService } from 'src/services/cart.service';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';

@Controller('cart')
export class CartController implements OnModuleInit {
  constructor(
    private readonly cartService: CartService,
    @Inject('CART_SERVICE') private readonly cartClient: ClientKafka
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addToCart(@Request() req, @Body() addToCartDto) {
    const userId = req.user.userId;
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@Request() req) {
    const userId = req.user.userId;
    return this.cartService.getCart(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateCart(@Request() req, @Body() updateCartDto) {
    const userId = req.user.userId;
    return this.cartService.updateCart(userId, updateCartDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove')
  async removeFromCart(@Request() req, @Body() removeFromCartDto) {
    const userId = req.user.userId;
    return this.cartService.removeFromCart(userId, removeFromCartDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('apply-coupon')
  async applyCoupon(@Request() req, @Body() applyCouponDto) {
    const userId = req.user.userId;
    return this.cartService.applyCoupon(userId, applyCouponDto);
  }

  // Guest routes
  @Post('guest/add')
  async guestAddToCart(@Body() addToCartDto, @Req() req) {
    const guestId = req.sessionID;
    return this.cartService.guestAddToCart(guestId, addToCartDto);
  }

  @Get('guest')
  async guestGetCart(@Req() req) {
    const guestId = req.sessionID;
    return this.cartService.guestGetCart(guestId);
  }

  @Put('guest/update')
  async guestUpdateCart(@Body() updateCartDto, @Req() req) {
    const guestId = req.sessionID;
    return this.cartService.guestUpdateCart(guestId, updateCartDto);
  }

  @Delete('guest/remove')
  async guestRemoveFromCart(@Body() removeFromCartDto, @Req() req) {
    const guestId = req.sessionID;
    return this.cartService.guestRemoveFromCart(guestId, removeFromCartDto);
  }

  @Post('convert')
  async convertCart(@Request() req, @Body() convertCartDto) {
    const userId = req.user.userId;
    const guestId = req.sessionID;
    return this.cartService.convertCart(guestId, userId);
  }

  async onModuleInit() {
    this.cartClient.subscribeToResponseOf('cart_add');
    this.cartClient.subscribeToResponseOf('cart_get');
    this.cartClient.subscribeToResponseOf('cart_update');
    this.cartClient.subscribeToResponseOf('cart_remove');
    this.cartClient.subscribeToResponseOf('cart_apply_coupon');
    this.cartClient.subscribeToResponseOf('cart_convert');
    this.cartClient.subscribeToResponseOf('cart_guest_add');
    this.cartClient.subscribeToResponseOf('cart_guest_get');
    this.cartClient.subscribeToResponseOf('cart_guest_update');
    this.cartClient.subscribeToResponseOf('cart_guest_remove');
    await this.cartClient.connect();
  }
}