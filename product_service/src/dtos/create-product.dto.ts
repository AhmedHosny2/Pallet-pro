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
  image: string;
  @IsNotEmpty()
  price: string;
  @IsNotEmpty()
  stock: string;

  toString() {
    return `title: ${this.title}, description: ${this.description}, image: ${this.image}, price: ${this.price}, stock: ${this.stock}`;
  }
}
