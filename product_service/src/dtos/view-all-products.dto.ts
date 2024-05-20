// view all products dto

import{ IsString ,
    IsNotEmpty,


} from 'class-validator';


export class ViewAllProductsDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsString()
    @IsNotEmpty()
    price: string;

    @IsString()
    @IsNotEmpty()
    stock: string;

    toString() {
        return `title: ${this.title}, description: ${this.description}, image: ${this.image}, price: ${this.price}, stock: ${this.stock}`;
    }
}