import {IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsNumber} from 'class-validator';

export class FavDTO {
    @IsString()
    @IsNotEmpty()
    productId: string;
// image , and name 

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;
    // images 
        @IsString()
        @IsNotEmpty()
        image: string;

}