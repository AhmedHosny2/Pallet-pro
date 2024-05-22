import { CartItemDto } from "./cart-item.dto";

export class AddToCartDto {
  userId?: string;
  guestId?: string;
  items: CartItemDto[];
}