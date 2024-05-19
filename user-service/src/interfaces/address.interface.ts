import { Document } from 'mongoose';

export interface Address extends Document {
    readonly name: string;
    readonly country: string;
    readonly city: string;
    readonly address_line_1: string;
    readonly address_line_2: string;
    readonly zip_code: string;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly user_id: string;
}