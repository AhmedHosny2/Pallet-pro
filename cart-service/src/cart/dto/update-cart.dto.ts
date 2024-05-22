export class UpdateCartDto {
  guestId?: string;
  userId?: string;
  updateData: { itemId: string, quantity: number };
}