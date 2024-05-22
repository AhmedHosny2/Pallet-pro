import { Document } from 'mongoose';

export interface ProductInterface {

// the product will have a title , description, image, price and stock
readonly name: string;
readonly description: string;
readonly image: string;
readonly price: string;
readonly label: string;
readonly colors:number;
 stock: string;
 rentList:
    {
    renter: string;
    rentDate: string;
    returnDate: string;
    quantity: number;
    }[];
    ratingList:
        {
        rating: number;
        review: string;
      
        }[];
}


