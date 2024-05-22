import { Document } from 'mongoose';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart extends Document {
  userId?: string;
  guestId?: string;
  items: CartItem[];
  coupon?: string;
}

// // src/cart/interfaces/cart.interface.ts
// import { Document } from 'mongoose';

// export interface Cart extends Document {
//   userId: string;
//   guestId: string;
//   readonly items: { productId: string; quantity: number }[];
//   readonly coupon: string;
// }
