import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    resetCode: { type: String, required: false },
    refreshToken: { type: String, required: false },
    verificationCode: { type: String, required: false },
    verified: { type: Boolean, default: false },
    wishList: { type: Array, default: [] },
});
