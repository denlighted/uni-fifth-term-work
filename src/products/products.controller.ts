import {Body, Controller, Get, Post} from '@nestjs/common';
import { ProductsService } from './products.service';
import {PrivateBrandsRequest} from "./dto/private-brands.dto";


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get("get-same-categories")
  async getNormalizedCategories() {
    return this.productsService.normalizeCategories()
  }

  @Get("get-same-products")
  async getNormalizedProducts() {
    return this.productsService.normalizeProducts()
  }


  @Post("store-private-brands")
  async writePrivateBrands(@Body()dto:PrivateBrandsRequest){
    console.log('DTO received:', dto);
    return this.productsService.writePrivateBrands(dto);
  }

  @Get("exclusive-test")
  async exclusiveTest(){
    return this.productsService.exclusiveTest();
  }
}
