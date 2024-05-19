import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KafkaService } from './kafka/kafka.service';
import { Cart } from './cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private readonly kafkaService: KafkaService
  ) {
    this.kafkaService.consume('cart_add', this.handleAddToCart.bind(this));
    this.kafkaService.consume('cart_get', this.handleGetCart.bind(this));
    this.kafkaService.consume('cart_update', this.handleUpdateCart.bind(this));
    this.kafkaService.consume('cart_remove', this.handleRemoveFromCart.bind(this));
    this.kafkaService.consume('cart_apply_coupon', this.handleApplyCoupon.bind(this));
    this.kafkaService.consume('cart_convert', this.handleConvertGuestCartToUserCart.bind(this));
  }

  async createCart(userId: string): Promise<Cart> {
    const newCart = new this.cartModel({ userId, items: [] });
    return newCart.save();
  }

  async createGuestCart(): Promise<string> {
    const guestId = 'guest_' + Math.random().toString(36).substring(2, 15);
    await this.createCart(guestId);
    return guestId;
  }

  async getCartByUserId(userId: string): Promise<Cart> {
    let cart
    cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      cart = await this.createCart(userId);
    }
    return cart;
  }

  async handleAddToCart({ userId, item }): Promise<void> {
    const cart = await this.getCartByUserId(userId);
    cart.items.push(item);
    await cart.save();
  }

  async handleGetCart({ userId }): Promise<void> {
    try {
      const cart = await this.getCartByUserId(userId);
      console.log(`Cart for user ${userId}:`, cart);
      // If you need to send a response back to Kafka, you can do it here.
      // For example, send a message to another topic with the cart details
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log(`Cart not found for user ${userId}`);
        // Optionally, send a "cart not found" message to another topic
      } else {
        throw error;
      }
    }
  }

  async handleUpdateCart({ userId, itemId, newItem }): Promise<void> {
    const cart = await this.getCartByUserId(userId);
    cart.items = cart.items.map(item => (item.id === itemId ? newItem : item));
    await cart.save();
  }

  async handleRemoveFromCart({ userId, itemId }): Promise<void> {
    const cart = await this.getCartByUserId(userId);
    cart.items = cart.items.filter(item => item.id !== itemId);
    await cart.save();
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getCartByUserId(userId);
    cart.items = [];
    await cart.save();
  }

  async handleApplyCoupon({ userId, couponCode }): Promise<void> {
    const cart = await this.getCartByUserId(userId);
    cart.coupon = couponCode;
    await cart.save();
  }

  async handleConvertGuestCartToUserCart({ guestId, userId }): Promise<void> {
    const guestCart = await this.getCartByUserId(guestId);
    let userCart = await this.getCartByUserId(userId);

    if (guestCart) {
      userCart.items = userCart.items.concat(guestCart.items);
      await this.cartModel.deleteOne({ userId: guestId }).exec();
      await userCart.save();
    }
  }
}


// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { KafkaService } from './kafka/kafka.service';
// import { Cart } from './cart.schema';

// @Injectable()
// export class CartService {
//   constructor(
//     @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
//     private readonly kafkaService: KafkaService
//   ) {
//     console.log('Subscribing to cart_add topic');
//     this.kafkaService.consume('cart_add', this.handleAddToCart.bind(this));
//     console.log('Subscribing to cart_get topic');
//     this.kafkaService.consume('cart_get', this.handleGetCart.bind(this));
//     console.log('Subscribing to cart_update topic');
//     this.kafkaService.consume('cart_update', this.handleUpdateCart.bind(this));
//     console.log('Subscribing to cart_remove topic');
//     this.kafkaService.consume('cart_remove', this.handleRemoveFromCart.bind(this));
//   }

//   async createCart(userId: string): Promise<Cart> {
//     const newCart = new this.cartModel({ userId, items: [] });
//     return newCart.save();
//   }

//   async getCartByUserId(userId: string): Promise<Cart> {
//     const cart = await this.cartModel.findOne({ userId });
//     if (!cart) {
//       this.createCart(userId);
//     }
//     return cart;
//   }

//   async handleAddToCart({ userId, item }): Promise<void> {
//     let cart;
//     try {
//       cart = await this.getCartByUserId(userId);
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         cart = await this.createCart(userId);
//       } else {
//         throw error;
//       }
//     }
//     cart.items.push(item);
//     await cart.save();
//   }

//   async handleGetCart({ userId }): Promise<void> {
//     try {
//       const cart = await this.getCartByUserId(userId);
//       console.log(`Cart for user ${userId}:`, cart);
//       // If you need to send a response back to Kafka, you can do it here.
//       // For example, send a message to another topic with the cart details
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         console.log(`Cart not found for user ${userId}`);
//         // Optionally, send a "cart not found" message to another topic
//       } else {
//         throw error;
//       }
//     }
//   }

//   async handleUpdateCart({ userId, itemId, newItem }): Promise<void> {
//     const cart = await this.getCartByUserId(userId);
//     cart.items = cart.items.map(item => (item.id === itemId ? newItem : item));
//     await cart.save();
//   }

//   async handleRemoveFromCart({ userId, itemId }): Promise<void> {
//     const cart = await this.getCartByUserId(userId);
//     cart.items = cart.items.filter(item => item.id !== itemId);
//     await cart.save();
//   }

//   async clearCart(userId: string): Promise<void> {
//     const cart = await this.getCartByUserId(userId);
//     cart.items = [];
//     await cart.save();
//   }

//   async applyCoupon(userId: string, couponCode: string): Promise<void> {
//     const cart = await this.getCartByUserId(userId);
//     cart.coupon = couponCode;
//     await cart.save();
//   }

//   async convertGuestCartToUserCart(guestId: string, userId: string): Promise<void> {
//     const guestCart = await this.getCartByUserId(guestId);
//     let userCart;
//     try {
//       userCart = await this.getCartByUserId(userId);
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         userCart = await this.createCart(userId);
//       } else {
//         throw error;
//       }
//     }

//     if (guestCart) {
//       userCart.items = userCart.items.concat(guestCart.items);
//       await this.cartModel.deleteOne({ userId: guestId }).exec();
//       await userCart.save();
//     }
//   }
// }
