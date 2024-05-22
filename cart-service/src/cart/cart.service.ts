import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartItem } from './interfaces/cart.interface';
import { CartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>) {}

  async createCart(cartData): Promise<Cart> {
    const newCart = new this.cartModel(cartData);
    return newCart.save();
  }

  async addToCart(userId: string, items: CartItemDto[]): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      const newCart = new this.cartModel({ userId, items });
      return newCart.save();
    }
    return this.cartModel.findOneAndUpdate(
      { userId },
      { $push: { items: { $each: items } } },
      { new: true }
    );
  }

  async addToGuestCart(guestId: string, items: CartItemDto[]): Promise<Cart> {
    const cart = await this.cartModel.findOne({ guestId });
    if (!cart) {
      const newCart = new this.cartModel({ guestId, items });
      return newCart.save();
    }
    return this.cartModel.findOneAndUpdate(
      { guestId },
      { $push: { items: { $each: items } } },
      { new: true }
    );
  }

  async getCart(userId: string): Promise<Cart> {
    return this.cartModel.findOne({ userId }).exec();
  }

  async getGuestCart(guestId: string): Promise<Cart> {
    return this.cartModel.findOne({ guestId }).exec();
  }

  async updateCart(userId: string, updateData): Promise<Cart> {
    const { itemId, quantity } = updateData;
    return this.cartModel.findOneAndUpdate(
      { userId, "items.productId": itemId },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    );
  }

  async updateGuestCart(guestId: string, updateData): Promise<Cart> {
    const { itemId, quantity } = updateData;
    return this.cartModel.findOneAndUpdate(
      { guestId, "items.productId": itemId },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    );
  }

  async removeFromCart(userId: string, itemId: string): Promise<Cart> {
    return this.cartModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId: itemId } } },
      { new: true }
    );
  }

  async removeFromGuestCart(guestId: string, itemId: string): Promise<Cart> {
    return this.cartModel.findOneAndUpdate(
      { guestId },
      { $pull: { items: { productId: itemId } } },
      { new: true }
    );
  }

  async applyCoupon(userId: string, coupon: string): Promise<Cart> {
    return this.cartModel.findOneAndUpdate(
      { userId },
      { coupon },
      { new: true }
    );
  }

  async applyCouponToGuestCart(guestId: string, coupon: string): Promise<Cart> {
    return this.cartModel.findOneAndUpdate(
      { guestId },
      { coupon },
      { new: true }
    );
  }

  async convertCart(guestId: string, userId: string): Promise<Cart> {
    const guestCart = await this.cartModel.findOne({ guestId });
    if (guestCart) {
      guestCart.userId = userId;
      guestCart.guestId = null;
      return guestCart.save();
    }
    return null;
  }
}

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Cart } from './interfaces/cart.interface';

// @Injectable()
// export class CartService {
//   constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>) {}

//   async createCart(cartData): Promise<Cart> {
//     console.log('I am in cart service in cart-service', cartData);
//     const newCart = new this.cartModel(cartData);
//     return newCart.save();
//   }

//   async addToCart(userId: string, items): Promise<Cart> {
//     console.log('I am in cart service in cart-service', userId, items);
//     const cart = await this.cartModel.findOne({ userId });
//     if (!cart) {
//       const newCart = new this.cartModel({ userId, items: [items] });
//       return newCart.save();
//     }
//     return this.cartModel.findOneAndUpdate({ userId }, { $push: { items: items } }, { new: true });
//   }

//   async addToGuestCart(guestId: string, items): Promise<Cart> {
//     console.log('I am in cart service in cart-service', guestId, items);
//     const cart = await this.cartModel.findOne({ guestId });
//     if (!cart) {
//       const newCart = new this.cartModel({ guestId, items: [items] });
//       return newCart.save();
//     }
//     return this.cartModel.findOneAndUpdate({ guestId }, { $push: { items: items } }, { new: true });
//   }

//   async getCart(userId: string): Promise<Cart> {
//     console.log('I am in cart service in cart-service', userId);
//     return this.cartModel.findOne({ userId }).exec();
//   }

//   async getGuestCart(guestId: string): Promise<Cart> {
//     console.log('I am in cart service in cart-service', guestId);
//     return this.cartModel.findOne({ guestId }).exec();
//   }

//   async updateCart(userId: string, updateData): Promise<Cart> {
//     console.log('I am in cart service in cart-service', userId, updateData);
//     return this.cartModel.findOneAndUpdate({ userId }, updateData, { new: true });
//   }

//   async updateGuestCart(guestId: string, updateData): Promise<Cart> {
//     console.log('I am in cart service in cart-service', guestId, updateData);
//     return this.cartModel.findOneAndUpdate({ guestId }, updateData, { new: true });
//   }

//   async removeFromCart(userId: string, itemId): Promise<Cart> {
//     console.log('I am in cart service in cart-service', userId, itemId);
//     return this.cartModel.findOneAndUpdate({ userId }, { $pull: { items: { productId: itemId } } }, { new: true });
//   }

//   async removeFromGuestCart(guestId: string, itemId): Promise<Cart> {
//     console.log('I am in cart service in cart-service', guestId, itemId);
//     return this.cartModel.findOneAndUpdate({ guestId }, { $pull: { items: { ptoductId: itemId } } }, { new: true });
//   }

//   async applyCoupon(userId: string, coupon): Promise<Cart> {
//     console.log('I am in cart service in cart-service', userId, coupon);
//     return this.cartModel.findOneAndUpdate({ userId }, { coupon }, { new: true });
//   }

//   async applyCouponToGuestCart(guestId: string, coupon): Promise<Cart> {
//     console.log('I am in cart service in cart-service', guestId, coupon);
//     return this.cartModel.findOneAndUpdate({ guestId }, { coupon }, { new: true });
//   }

//   async convertCart(guestId: string, userId: string): Promise<Cart> {
//     console.log('I am in cart service in cart-service', guestId, userId);
//     const guestCart = await this.cartModel.findOne({ guestId });
//     if (guestCart) {
//       guestCart.userId = userId;
//       guestCart.guestId = null;
//       return guestCart.save();
//     }
//     return null;
//   }
// }
