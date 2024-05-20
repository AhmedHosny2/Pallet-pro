// src/cart/schemas/cart.schema.ts
import { Schema } from 'mongoose';

export const CartSchema = new Schema({
  userId: String,
  guestId: String,
  items: [
    {
      productId: String,
      quantity: Number,
    },
  ],
  coupon: String,
});
