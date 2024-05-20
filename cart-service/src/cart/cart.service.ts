// src/cart/cart.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './interfaces/cart.interface';

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>) {}

  async createCart(cartData): Promise<Cart> {
    const newCart = new this.cartModel(cartData);
    return newCart.save();
  }

  async addToCart(userId: string, item): Promise<Cart> {
    return this.cartModel.findOneAndUpdate({ userId }, { $push: { items: item } }, { new: true });
  }

  async getCart(userId: string): Promise<Cart> {
    return this.cartModel.findOne({ userId }).exec();
  }

  async updateCart(userId: string, updateData): Promise<Cart> {
    return this.cartModel.findOneAndUpdate({ userId }, updateData, { new: true });
  }

  async removeFromCart(userId: string, itemId): Promise<Cart> {
    return this.cartModel.findOneAndUpdate({ userId }, { $pull: { items: { _id: itemId } } }, { new: true });
  }

  async applyCoupon(userId: string, coupon): Promise<Cart> {
    return this.cartModel.findOneAndUpdate({ userId }, { coupon }, { new: true });
  }

  async convertCart(guestId: string, userId: string): Promise<Cart> {
    return this.cartModel.findOneAndUpdate({ guestId }, { userId }, { new: true });
  }
}
