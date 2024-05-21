import {IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsNumber} from 'class-validator';

export class GetWishlistDTO {
    @IsString()
    @IsNotEmpty()
    wishListName: string;

    toString() {
        return JSON.stringify({
            wishListName: this.wishListName,
        });
    }
}