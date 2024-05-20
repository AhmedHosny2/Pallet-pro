// src/cart/cart.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern('cart_create')
  async createCart(@Payload() data) {
    return this.cartService.createCart(data);
  }

  @MessagePattern('cart_add')
  async addToCart(@Payload() data) {
    return this.cartService.addToCart(data.userId, data.items);
  }

  @MessagePattern('cart_get')
  async getCart(@Payload() data) {
    return this.cartService.getCart(data.userId);
  }

  @MessagePattern('cart_update')
  async updateCart(@Payload() data) {
    return this.cartService.updateCart(data.userId, data.updateData);
  }

  @MessagePattern('cart_remove')
  async removeFromCart(@Payload() data) {
    return this.cartService.removeFromCart(data.userId, data.itemId);
  }

  @MessagePattern('cart_apply_coupon')
  async applyCoupon(@Payload() data) {
    return this.cartService.applyCoupon(data.userId, data.coupon);
  }

  @MessagePattern('cart_convert')
  async convertCart(@Payload() data) {
    return this.cartService.convertCart(data.guestId, data.userId);
  }
}
