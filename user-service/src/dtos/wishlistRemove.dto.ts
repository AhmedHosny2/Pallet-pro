import {IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsNumber} from 'class-validator';

export class RemoveFromWishlistDTO {
    @IsString()
    @IsNotEmpty()
    wishListName: string;

    @IsString()
    @IsNotEmpty()
    productId: string;

    toString() {
        return JSON.stringify({
            wishListName: this.wishListName,
            productId: this.productId,
        });
    }
}