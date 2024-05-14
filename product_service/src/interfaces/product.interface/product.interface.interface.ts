import { Document } from 'mongoose';

export interface ProductInterface {

// the product will have a title , description, image, price and stock
readonly title: string;
readonly description: string;
readonly image: string;
readonly price: string;
readonly stock: string;
}
