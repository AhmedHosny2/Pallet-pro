import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Product } from './schemas/products.schema';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: mongoose.Model<Product>,
  ) {
    console.log('Product Service created', this.productModel);
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find();
    return products;
  }
  async addProduct(product: Product): Promise<Product> {
    // const newProduct = new this.productModel(product);
    // const newProduct = new this.productModel(product);
    const newProduct = await this.productModel.create(product);
    return newProduct;
  }
}
