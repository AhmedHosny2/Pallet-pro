import{
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    MinLength
} from 'class-validator';

export class RentProductDto {
   // rent date
   // return date
    // quantity
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
    @IsNotEmpty()
    @IsString()
    rentDate: string;
    @IsNotEmpty()
    @IsString()
    returnDate: string;
    toString() {
        return `quantity: ${this.quantity}, rentDate: ${this.rentDate}, returnDate: ${this.returnDate}`;
    }

}