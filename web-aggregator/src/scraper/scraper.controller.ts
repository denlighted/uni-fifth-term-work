import {Controller, Delete, Get, Param, Post} from '@nestjs/common';
import { ScraperService } from './scraper.service';
import {Authorization} from "../auth/decorators";
import {RoleEnum} from "../auth/enums";

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Authorization(RoleEnum.ADMIN)
  @Delete('categories')
  async cleanCategCollection(){
    return this.scraperService.cleanCategCollection();
  }

  @Authorization(RoleEnum.ADMIN)
  @Delete('clean-collection')
  async cleanProdCollection(){
    return this.scraperService.cleanProdCollection();
  }

  @Authorization(RoleEnum.ADMIN)
  @Delete('fora')
  async delete(){
    return this.scraperService.deleteForaProd()
  }

  @Authorization(RoleEnum.ADMIN)
  @Post('all/atb-products')
  async writeAllAtbProducts(){
    return this.scraperService.writeAllAtbProducts();
  }

  @Authorization(RoleEnum.ADMIN)
  @Post('all/fora-products')
  async writeAllForaProducts(){
    return this.scraperService.writeAllForaProducts();
  }


  @Authorization(RoleEnum.ADMIN)
  @Get('atb/pages')
  //@Authorization(RoleEnum.ADMIN)
  async getAllAtbProducts() {
    return this.scraperService.getAllAtbProducts();
  }

  @Authorization(RoleEnum.ADMIN)
  @Get('atb/pages/:id')
  async getAtbProductById(@Param('id') id: string) {
    return this.scraperService.getAtbProductById(id);
  }

  @Authorization(RoleEnum.ADMIN)
  @Get('fora/pages')
  async getAllForaProduct() {
    return this.scraperService.getAllForaProducts();
  }

  @Authorization(RoleEnum.ADMIN)
  @Get('fora/pages/:id')
  async getForaProductById(@Param('id') id: string) {
    return this.scraperService.getForaProductById(id);
  }

  @Authorization(RoleEnum.ADMIN)
  @Post('atb/pages/:categoryId')
  async writeAtbProductsByCategory(@Param('categoryId')categoryId:string){
    return this.scraperService.writeAtbProductsByCategory(categoryId);
  }

  @Authorization(RoleEnum.ADMIN)
  @Post('fora/pages/:categoryId')
  async writeForaProductsByCategory(@Param('categoryId')categoryId:string){
    return this.scraperService.writeForaProductsByCategory(categoryId);
  }

  @Authorization(RoleEnum.ADMIN)
  @Get('atb/categories')
  async getAllAtbCategories(){
    return this.scraperService.getAllAtbCategories();
  }


  @Authorization(RoleEnum.ADMIN)
  @Get('fora/categories')
  async getAllForaCategories(){
    return this.scraperService.getAllForaCategories();
  }

  @Authorization(RoleEnum.ADMIN)
  @Get('atb/category/:id')
  async getAtbCategoryById(@Param('id')id:string){
    return this.scraperService.getAtbCategoryById(id)
  }

  @Authorization(RoleEnum.ADMIN)
  @Get('fora/category/:id')
  async getForaCategoryById(@Param('id')id:string){
    return this.scraperService.getForaCategoryById(id)
  }

  @Authorization(RoleEnum.ADMIN)
  @Post('atb/categories')
  async writeAtbCategories(){
    return this.scraperService.writeAtbCategories();
  }

  @Authorization(RoleEnum.ADMIN)
  @Post("fora/categories")
  async writeForaCategories(){
    return this.scraperService.writeForaCategories()
  }
}