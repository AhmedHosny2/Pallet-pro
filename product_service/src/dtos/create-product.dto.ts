import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
  @IsString()
  images:  Array<string>;
  @IsNotEmpty()
  price: string;
  @IsNotEmpty()
  stock: string;
  @IsNotEmpty()
  @IsString()
  specifications: string;

  toString() {
    return `title: ${this.title}, description: ${this.description}, image: ${this.images}, price: ${this.price}, stock: ${this.stock}`;
  }
}
