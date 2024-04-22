import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({
    required: true,
  })
  title: string;
  @Prop({
    required: true,

  })
  description: string;
    @Prop({
        required: true,
    })
    price: number;
    @Prop({
        required: true,
    })
    images: string;
    @Prop({
        required: true,
    })
    available: boolean;
    @Prop({
        required: true,
    })
    specifications: string;

}
export const ProductSchema = SchemaFactory.createForClass(Product);
