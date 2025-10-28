import {Controller, Delete, Get, Param, Post} from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  // @Get('atb/links')
  // async getAtbProductLinks(){
  //   return this.scraperService.getProductCardUrlAtb()
  // }
  //
  // @Get('atb')
  // async getProducts(){
  //   return this.scraperService.getProductsAtb();
  // }


  // @Get('fora/links')
  // async getForaProductsLinks(){
  //   return this.scraperService.getForaProductLinks()
  // }
  //


  @Delete('categories')
  async cleanCategCollection(){
    return this.scraperService.cleanCategCollection();
  }

  @Delete('products')
  async cleanProdCollection(){
    return this.scraperService.cleanProdCollection();
  }


  @Delete('fora')
  async delete(){
    return this.scraperService.deleteForaProd()
  }

  @Post('all/atb/products')
  async writeAllAtbProducts(){
    return this.scraperService.writeAllAtbProducts();
  }

  @Post('all/fora/products')
  async writeAllForaProducts(){
    return this.scraperService.writeAllForaProducts();
  }


  @Get('atb/products')
  async getAllAtbProducts() {
    return this.scraperService.getAllAtbProducts();
  }

  @Get('atb/products/:id')
  async getAtbProductById(@Param('id') id: string) {
    return this.scraperService.getAtbProductById(id);
  }

  @Get('fora/products')
  async getAllForaProduct() {
    return this.scraperService.getAllForaProducts();
  }

  @Get('fora/products/:id')
  async getForaProductById(@Param('id') id: string) {
    return this.scraperService.getForaProductById(id);
  }

  @Post('atb/products/:categoryId')
  async writeAtbProductsByCategory(@Param('categoryId')categoryId:string){
    return this.scraperService.writeAtbProductsByCategory(categoryId);
  }

  @Post('fora/products/:categoryId')
  async writeForaProductsByCategory(@Param('categoryId')categoryId:string){
    return this.scraperService.writeForaProductsByCategory(categoryId);
  }


  @Get('atb/categories')
  async getAllAtbCategories(){
    return this.scraperService.getAllAtbCategories();
  }

  @Get('fora/categories')
  async getAllForaCategories(){
    return this.scraperService.getAllForaCategories();
  }

  @Get('atb/category/:id')
  async getAtbCategoryById(@Param('id')id:string){
    return this.scraperService.getAtbCategoryById(id)
  }

  @Get('fora/category/:id')
  async getForaCategoryById(@Param('id')id:string){
    return this.scraperService.getForaCategoryById(id)
  }

  @Post('atb/categories')
  async writeAtbCategories(){
    return this.scraperService.writeAtbCategories();
  }

  @Post("fora/categories")
  async writeForaCategories(){
    return this.scraperService.writeForaCategories()
  }
}