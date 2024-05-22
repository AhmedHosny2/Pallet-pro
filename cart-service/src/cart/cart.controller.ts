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
    if (data.userId) {
      return this.cartService.addToCart(data.userId, data.items);
    } else if (data.guestId) {
      return this.cartService.addToGuestCart(data.guestId, data.items);
    }
  }

  @MessagePattern('cart_get')
  async getCart(@Payload() data) {
    if (data.userId) {
      return this.cartService.getCart(data.userId);
    } else if (data.guestId) {
      return this.cartService.getGuestCart(data.guestId);
    }
  }

  @MessagePattern('cart_update')
  async updateCart(@Payload() data) {
    if (data.userId) {
      return this.cartService.updateCart(data.userId, data.updateData);
    } else if (data.guestId) {
      return this.cartService.updateGuestCart(data.guestId, data.updateData);
    }
  }

  @MessagePattern('cart_remove')
  async removeFromCart(@Payload() data) {
    if (data.userId) {
      return this.cartService.removeFromCart(data.userId, data.itemId);
    } else if (data.guestId) {
      return this.cartService.removeFromGuestCart(data.guestId, data.itemId);
    }
  }

  @MessagePattern('cart_apply_coupon')
  async applyCoupon(@Payload() data) {
    if (data.userId) {
      return this.cartService.applyCoupon(data.userId, data.coupon);
    } else if (data.guestId) {
      return this.cartService.applyCouponToGuestCart(data.guestId, data.coupon);
    }
  }

  @MessagePattern('cart_convert')
  async convertCart(@Payload() data) {
    return this.cartService.convertCart(data.guestId, data.userId);
  }
}

// import { Controller } from '@nestjs/common';
// import { MessagePattern, Payload } from '@nestjs/microservices';
// import { CartService } from './cart.service';

// @Controller()
// export class CartController {
//   constructor(private readonly cartService: CartService) {}

//   @MessagePattern('cart_create')
//   async createCart(@Payload() data) {
//     console.log('I am in cart controller', data);
//     return this.cartService.createCart(data);
//   }

//   @MessagePattern('cart_add')
//   async addToCart(@Payload() data) {
//     console.log('I am in cart controller', data);
//     if (data.userId) {
//       return this.cartService.addToCart(data.userId, data.items);
//     } else if (data.guestId) {
//       return this.cartService.addToGuestCart(data.guestId, data.items);
//     }
//   }

//   @MessagePattern('cart_get')
//   async getCart(@Payload() data) {
//     console.log('I am in cart controller', data);
//     if (data.userId) {
//       return this.cartService.getCart(data.userId);
//     } else if (data.guestId) {
//       return this.cartService.getGuestCart(data.guestId);
//     }
//   }

//   @MessagePattern('cart_update')
//   async updateCart(@Payload() data) {
//     console.log('I am in cart controller', data);
//     if (data.userId) {
//       return this.cartService.updateCart(data.userId, data.updateData);
//     } else if (data.guestId) {
//       return this.cartService.updateGuestCart(data.guestId, data.updateData);
//     }
//   }

//   @MessagePattern('cart_remove')
//   async removeFromCart(@Payload() data) {
//     console.log('I am in cart controller', data);
//     if (data.userId) {
//       return this.cartService.removeFromCart(data.userId, data.productId);
//     } else if (data.guestId) {
//       return this.cartService.removeFromGuestCart(data.guestId, data.productId);
//     }
//   }

//   @MessagePattern('cart_apply_coupon')
//   async applyCoupon(@Payload() data) {
//     console.log('I am in cart controller', data);
//     if (data.userId) {
//       return this.cartService.applyCoupon(data.userId, data.coupon);
//     } else if (data.guestId) {
//       return this.cartService.applyCouponToGuestCart(data.guestId, data.coupon);
//     }
//   }

//   @MessagePattern('cart_convert')
//   async convertCart(@Payload() data) {
//     console.log('I am in cart controller', data);
//     return this.cartService.convertCart(data.guestId, data.userId);
//   }
// }
