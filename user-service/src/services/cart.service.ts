import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
// import { KafkaService } from './kafka.service';

@Injectable()
export class CartService {
 // constructor(private readonly kafkaService: KafkaService) {}
 constructor(@Inject ('CART_SERVICE') private readonly cartClient: ClientKafka) {}

  async addToCart(userId: string, addToCartDto: any) {
    const payload = { userId, ...addToCartDto };
    console.log('payload', payload);
    const req = this.cartClient.send('cart_add', payload);
    req.subscribe((res) => console.log('Response:', res));
    return req;
  }

  async getCart(userId: string) {
    console.log('userId', userId);
    const req = this.cartClient.send('cart_get', { userId });
    req.subscribe((res) => console.log('Response:', res));
    return req;
  }

  async updateCart(userId: string, updateCartDto: any) {
    const payload = { userId, ...updateCartDto };
    console.log('User ID:', userId, 'Payload:', payload)
    const req = this.cartClient.send('cart_update', payload);
    req.subscribe((res) => console.log('Response:', res));
    return req;
  }

  async removeFromCart(userId: string, removeFromCartDto: any) {
    const payload = { userId, ...removeFromCartDto };
    console.log('User ID:', userId, 'Payload:', payload)
    const req = this.cartClient.send('cart_remove', payload);
    req.subscribe((res) => console.log('Response:', res));
    return req;
  }

  async applyCoupon(userId: string, applyCouponDto: any) {
    const payload = { userId, ...applyCouponDto };
    console.log('User ID:', userId, 'Payload:', payload)
    const req = this.cartClient.send('cart_apply_coupon', payload);
    req.subscribe((res) => console.log('Response:', res));
    return req;
  }

  async convertCart(guestId: string, userId: string) {
    const payload = { guestId, userId };
    console.log('Payload:', payload)
    const req = this.cartClient.send('cart_convert', payload);
    req.subscribe((res) => console.log('Response:', res));
    return req;
}
  
    async createCart(guestId: string) {
      const payload = { guestId };
      console.log('Payload:', payload)
      const req = this.cartClient.send('cart_create', payload);
      req.subscribe((res) => console.log('Response:', res));
      return req;
  }
}

// import { Injectable } from '@nestjs/common';
// import { KafkaService } from './kafka.service';

// @Injectable()
// export class CartService {
//   constructor(private readonly kafkaService: KafkaService) {}

//   async addToCart(userId: string, addToCartDto: any) {
//     const payload = { userId, ...addToCartDto };
//     console.log('payload', payload);
//     return this.kafkaService.produceEvent('cart_add', payload);
//   }

//   async getCart(userId: string) {
//     console.log('userId', userId);
//     return this.kafkaService.produceEvent('cart_get', { userId });
//   }

//   async updateCart(userId: string, updateCartDto: any) {
//     const payload = { userId, ...updateCartDto };
//     console.log('User ID:', userId, 'Payload:', payload)
//     return this.kafkaService.produceEvent('cart_update', payload);
//   }

//   async removeFromCart(userId: string, removeFromCartDto: any) {
//     const payload = { userId, ...removeFromCartDto };
//     console.log('User ID:', userId, 'Payload:', payload)
//     return this.kafkaService.produceEvent('cart_remove', payload);
//   }
// }
