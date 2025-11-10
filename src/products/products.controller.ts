import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import { ProductsService } from './services/products.service';
import type{PrivateBrandsRequest} from "./dto";
import {RestProductService} from "./services/rest-products.service";


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService,
              private readonly restProductService: RestProductService,) {}

  @Get("get-same-categories")
  async getNormalizedCategories() {
    return this.productsService.normalizeCategories()
  }

  @Post("get-same-products")
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
    return this.productsService.DeletePrivateBrands();
  }



  @Get("all-united-categories")
  async getAllUnitedCategories(){
    return this.restProductService.getAllUnitedCategories();
  }

  @Get("all-united-products")
  async getAllUnitedProducts(){
    return this.restProductService.getAllUnitedProducts();
  }

  @Get('products/:slug')
  async getUnitedProductBySlug(@Query('slug') slug: string){
    return this.restProductService.getUnitedProductBySlug(slug);
  }


  @Get('test')
  async test(){
    return this.productsService.testBrand();
  }
}
