import {IsString, IsEmail, IsNotEmpty, MinLength, MaxLength} from 'class-validator';

export class CreateWishlistDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    image: any;

    toString() {
        return JSON.stringify({
            name: this.name,
            image: this.image
        });
    }
}