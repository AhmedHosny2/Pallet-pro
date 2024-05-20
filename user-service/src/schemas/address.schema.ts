import { isPhoneNumber } from 'class-validator';
import * as mongoose from 'mongoose';

export const AddressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    address_line_1: { type: String, required: true },
    address_line_2: { type: String },
    phone_number: { type: String, required: true, isPhoneNumber: true },
    zip_code: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});