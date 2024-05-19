


import { IsNotEmpty, IsString } from 'class-validator';
import exp from 'constants';


    export class WishlistDto {
        @IsString()
        @IsNotEmpty()
        title: string;
    
        @IsString()
        @IsNotEmpty()
        image: string;
    
        @IsString()
        @IsNotEmpty()
        price: string;
    
        toString() {
            return `title: ${this.title}, image: ${this.image}, price: ${this.price}`;
        }
    }