import { Controller, Get } from '@nestjs/common';
import { ProductService } from '../services/product.service';

@Controller('product')

export class ProductServiceController {

    constructor(
        private readonly productService: ProductService, // so that we can use the methods from the AuthService class
      ) {}

// start with user get all products 
@Get('all')
    async getAllProducts() {
        return this.productService.getAllProducts();
    }



}
