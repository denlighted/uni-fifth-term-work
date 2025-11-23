import {Controller, Delete, Get, Param, Post} from '@nestjs/common';
import { ScraperService } from './scraper.service';
import {Authorization} from "../auth/decorators";
import {RoleEnum} from "../auth/enums";

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Delete('categories')
  async cleanCategCollection(){
    return this.scraperService.cleanCategCollection();
  }

  @Delete('pages')
  async cleanProdCollection(){
    return this.scraperService.cleanProdCollection();
  }


  @Delete('fora')
  async delete(){
    return this.scraperService.deleteForaProd()
  }

  @Post('all/atb/pages')
  async writeAllAtbProducts(){
    return this.scraperService.writeAllAtbProducts();
  }

  @Post('all/fora/pages')
  async writeAllForaProducts(){
    return this.scraperService.writeAllForaProducts();
  }



  @Get('atb/pages')
  //@Authorization(RoleEnum.ADMIN)
  async getAllAtbProducts() {
    return this.scraperService.getAllAtbProducts();
  }

  @Get('atb/pages/:id')
  async getAtbProductById(@Param('id') id: string) {
    return this.scraperService.getAtbProductById(id);
  }

  @Get('fora/pages')
  async getAllForaProduct() {
    return this.scraperService.getAllForaProducts();
  }

  @Get('fora/pages/:id')
  async getForaProductById(@Param('id') id: string) {
    return this.scraperService.getForaProductById(id);
  }

  @Post('atb/pages/:categoryId')
  async writeAtbProductsByCategory(@Param('categoryId')categoryId:string){
    return this.scraperService.writeAtbProductsByCategory(categoryId);
  }

  @Post('fora/pages/:categoryId')
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