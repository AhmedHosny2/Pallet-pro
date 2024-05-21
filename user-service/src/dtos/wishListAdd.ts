import {IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsNumber} from 'class-validator';

export class AddToWishlistDTO {
    @IsString()
    @IsNotEmpty()
    wishListName: string;

    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    toString() {
        return JSON.stringify({
            wishListName: this.wishListName,
            productId: this.productId,
            price: this.price,
            amount: this.amount
        });
    }
}