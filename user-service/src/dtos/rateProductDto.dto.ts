import 
{
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min
} from 'class-validator';

export class RateProductDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;
    @IsNotEmpty()
    @IsString()
    review: string;
    @IsNotEmpty()
    @IsString()
    userId: string;
    toString() {
        return `rating: ${this.rating}, review: ${this.review} userId: ${this.userId}`;
    }
}