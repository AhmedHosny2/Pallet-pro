// src/cart/interfaces/cart.interface.ts
import { Document } from 'mongoose';

export interface Cart extends Document {
  readonly userId: string;
  readonly guestId: string;
  readonly items: { productId: string; quantity: number }[];
  readonly coupon: string;
}
