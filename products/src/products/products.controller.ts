import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from 'src/products/schemas/products.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }
  @Post()
    async addProduct(
        @Body() product: CreateProductDto,
    ): Promise<Product> {
        return this.productsService.addProduct(product);
    }
}
