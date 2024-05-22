import { CartItemDto } from "./cart-item.dto";

export class CreateCartDto {
  guestId?: string;
  userId?: string;
  items: CartItemDto[];
}