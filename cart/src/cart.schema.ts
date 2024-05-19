import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Cart extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: Array, default: [] })
  items: any[];

  @Prop()
  coupon?: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
