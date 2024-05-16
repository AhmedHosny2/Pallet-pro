import * as mongoose from 'mongoose';
export const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: Array, required: true },

  price: { type: Number, required: true },

  stock: { type: Number, required: true },
  rentList  : { type: Array, required: false },
  ratingList: { type: Array, required: false },
});
