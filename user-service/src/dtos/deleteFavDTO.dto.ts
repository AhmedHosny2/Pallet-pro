import {IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsNumber} from 'class-validator';

export class deleteFavDTO {
    @IsString()
    @IsNotEmpty()
    productId: string;


}