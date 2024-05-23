import { Document } from 'mongoose';

export interface Order extends Document {
    user_id: string;
    price: number;
    status: string;
    addressId: string;
    products: {
        id: string;
        itemPrice: number;
        amount: number;
        image: string;
        name: string;
    }[];
    created_at: Date;
    updated_at: Date;
}