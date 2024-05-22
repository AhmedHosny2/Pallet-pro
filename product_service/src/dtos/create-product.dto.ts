import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
  @IsString()
  images:  string;
  @IsNotEmpty()
  price: string;
  @IsNotEmpty()
  stock: string;
  @IsNotEmpty()
  @IsString()
  specifications: string;
  // add label and color
  @IsNotEmpty()
  label: string;

  @IsNotEmpty()
  colors: number;


  toString() {
    return `title: ${this.name}, description: ${this.description}, image: ${this.images}, price: ${this.price}, stock: ${this.stock}`;
  }
}
