


import { IsNotEmpty, IsString } from 'class-validator';


    export class WishlistDto {
        @IsString()
        @IsNotEmpty()
        title: string;
    
        @IsString()
        @IsNotEmpty()
        image: Array<string>;
    
        @IsString()
        @IsNotEmpty()
        price: string;
        @IsString()
        @IsNotEmpty()
        id: string;
        toString() {
            return `title: ${this.title}, image: ${this.image}, price: ${this.price} id: ${this.id}`;
        }
    }