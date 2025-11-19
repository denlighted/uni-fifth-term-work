import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {ProductsService} from './services/products.service';
import type {PrivateBrandsRequest} from "./dto";
import {RestProductService} from "./services/rest-products.service";
import {ParseObjectIdPipe} from "@nestjs/mongoose";


@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService,
                private readonly restProductService: RestProductService,) {
    }

    @Get("get-same-categories")
    async getNormalizedCategories() {
        return this.productsService.normalizeCategories()
    }

    @Post("get-same-products")
    async getNormalizedProducts() {
        return this.productsService.normalizeProducts()
    }

    @Post("store-private-brands")
    async writePrivateBrands(@Body() dto: PrivateBrandsRequest) {
        console.log('DTO received:', dto);
        return this.productsService.writePrivateBrands(dto);
    }

    @Get("exclusive-test")
    async exclusiveTest() {
        return this.productsService.DeletePrivateBrands();
    }

    @Get("all-united-categories")
    async getAllUnitedCategories() {
        return this.restProductService.getAllUnitedCategories();
    }

    @Get("all-united-products")
    async getAllUnitedProducts() {
        return this.restProductService.getAllUnitedProducts();
    }

    @Get('slug/:slug')
    async getUnitedProductBySlug(@Param('slug') slug: string) {
        return this.restProductService.getUnitedProductBySlug(slug);
    }

    @Get('id/:id')
    async getUnitedProductById(@Param('id', new ParseObjectIdPipe()) id: string) {
        return this.restProductService.getUnitedProductById(id);
    }

    /// Test method for brand checking

    @Get('test')
    async test() {
        return this.productsService.testBrand();
    }
}
