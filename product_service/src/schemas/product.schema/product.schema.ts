import * as mongoose from 'mongoose';
export const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: String, required: true },
  colors: { type: Number, required: true },
  label: { type: String, required: true },

  price: { type: Number, required: true },

  stock: { type: Number, required: true },
  rentList  : { type: Array, required: false },
  ratingList: { type: Array, required: false },
  relatedProducts: { type: Array, required: false },
});
