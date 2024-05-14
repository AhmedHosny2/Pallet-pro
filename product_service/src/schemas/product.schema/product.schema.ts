
import * as mongoose from 'mongoose';
export const ProductSchema  = new mongoose.Schema({

title : {type: String, required: true},
description  :{type: String, required: true},
image : {type: String, required: true},

price  :{type: Number, required: true},

stock : {type: Number, required: true},




});