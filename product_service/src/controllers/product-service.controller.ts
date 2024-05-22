import { Body, Controller, Get, Param, Post, UseGuards,Request } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { RentProductDto } from 'src/dtos/rent-product.dto';
import { WishlistDto } from 'src/dtos/wishlistDto.dto';
import { JwtAuthGuard } from 'strategies/jwt-auth.guard';
@Controller('product')
export class ProductServiceController {
  constructor(
    private readonly productService: ProductService, // so that we can use the methods from the AuthService class
  ) {}
  @UseGuards(JwtAuthGuard) 
  @Get('user')
  async getUser(@Request() req) {
    console.log('req.user:\n\n\n\n\n\n\n\n\nhallo');
    
    return req.user;
  }

  // create wish list 
// @UseGuards(JwtAuthGuard) 
// @Post('wishlist/:id')
// async createWishlist(@Request() req, @Body() wishlistDto: WishlistDto) {
//     return this.productService.addToWishlist( wishlistDto, req.user.userId);
//   }


  // start with user get all products
  @Get('/')
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  // create a product get body from req and pass it as dto
  @Post('/create')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }
  // get one product by id from url
  @Get('/:id')
  async getProductById(@Param('id') id: string) {
    console.log('\n\n\n\n\n\n\nid:', id);

    return this.productService.getProductById(id);
  }
  @Post('rent/:id')
    async rentProduct(@Param('id') id: string, @Body() rentProductDto: RentProductDto){

        return this.productService.rentProduct(id, rentProductDto);
    }



  // http://localhost:3000/product/
  // http://localhost:3000/product/create
  // one product by id
  // http://localhost:3000/product/60c3c6b1e8b5a2f2a4b5d8b0
}
