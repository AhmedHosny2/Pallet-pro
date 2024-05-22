import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class CartService {
  constructor(@Inject('CART_SERVICE') private readonly cartClient: ClientKafka) {}

  async addToCart(userId: string, addToCartDto: any) {
    const payload = { userId, items: addToCartDto.items };
    return this.cartClient.send('cart_add', payload).toPromise();
  }

  async getCart(userId: string) {
    return this.cartClient.send('cart_get', { userId }).toPromise();
  }

  async updateCart(userId: string, updateCartDto: any) {
    const payload = { userId, updateData: updateCartDto };
    return this.cartClient.send('cart_update', payload).toPromise();
  }

  async removeFromCart(userId: string, removeFromCartDto: any) {
    const payload = { userId, itemId: removeFromCartDto.itemId };
    return this.cartClient.send('cart_remove', payload).toPromise();
  }

  async applyCoupon(userId: string, applyCouponDto: any) {
    const payload = { userId, coupon: applyCouponDto.coupon };
    return this.cartClient.send('cart_apply_coupon', payload).toPromise();
  }

  // Guest methods
  async guestAddToCart(guestId: string, addToCartDto: any) {
    const payload = { guestId, items: addToCartDto.items };
    return this.cartClient.send('cart_guest_add', payload).toPromise();
  }

  async guestGetCart(guestId: string) {
    return this.cartClient.send('cart_guest_get', { guestId }).toPromise();
  }

  async guestUpdateCart(guestId: string, updateCartDto: any) {
    const payload = { guestId, updateData: updateCartDto };
    return this.cartClient.send('cart_guest_update', payload).toPromise();
  }

  async guestRemoveFromCart(guestId: string, removeFromCartDto: any) {
    const payload = { guestId, itemId: removeFromCartDto.itemId };
    return this.cartClient.send('cart_guest_remove', payload).toPromise();
  }

  async convertCart(guestId: string, userId: string) {
    const payload = { guestId, userId };
    return this.cartClient.send('cart_convert', payload).toPromise();
  }
}

// import { Inject, Injectable } from '@nestjs/common';
// import { ClientKafka } from '@nestjs/microservices';

// @Injectable()
// export class CartService {
//   constructor(@Inject('CART_SERVICE') private readonly cartClient: ClientKafka) {}

//   async addToCart(userId: string, addToCartDto: any) {
//     const payload = { userId, ...addToCartDto };
//     const req = this.cartClient.send('cart_add', payload);
//     req.subscribe((res) => console.log('Response:', res));
//     return req;
//   }

//   async getCart(userId: string) {
//     const req = this.cartClient.send('cart_get', { userId });
//     req.subscribe((res) => console.log('Response:', res));
//     return req;
//   }

//   async updateCart(userId: string, updateCartDto: any) {
//     const payload = { userId, ...updateCartDto };
//     const req = this.cartClient.send('cart_update', payload);
//     req.subscribe((res) => console.log('Response:', res));
//     return req;
//   }

//   async removeFromCart(userId: string, removeFromCartDto: any) {
//     const payload = { userId, ...removeFromCartDto };
//     const req = this.cartClient.send('cart_remove', payload);
//     req.subscribe((res) => console.log('Response:', res));
//     return req;
//   }

//   async applyCoupon(userId: string, applyCouponDto: any) {
//     const payload = { userId, ...applyCouponDto };
//     const req = this.cartClient.send('cart_apply_coupon', payload);
//     req.subscribe((res) => console.log('Response:', res));
//     return req;
//   }

//   // Guest methods
//   async guestAddToCart(guestId: string, addToCartDto: any) {
//     const payload = { guestId, ...addToCartDto };
//     const req = this.cartClient.send('cart_guest_add', payload);
//     req.subscribe((res) => console.log('Response:', res));
//     return req;
//   }

//   async guestGetCart(guestId: string) {
//     const req = this.cartClient.send('cart_guest_get', { guestId });
//     req.subscribe((res) => console.log('Response:', res));
//     return req;
//   }

//   async guestUpdateCart(guestId: string, updateCartDto: any) {
//     const payload = { guestId, ...updateCartDto };
//     const req = this.cartClient.send('cart_guest_update', payload);
//     req.subscribe((res) => console.log('Response:', res));
//     return req;
//   }

//   async guestRemoveFromCart(guestId: string, removeFromCartDto: any) {
//     const payload = { guestId, ...removeFromCartDto };
//     const req = this.cartClient.send('cart_guest_remove', payload);
//     req.subscribe((res) => console.log('Response:', res));
//     return req;
//   }
// }