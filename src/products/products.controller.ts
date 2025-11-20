import {Body, Controller, Get, Param, Post, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import {ProductsService} from './services/products.service';
import type {PrivateBrandsRequest} from "./dto";
import {RestProductService} from "./services/rest-products.service";
import {ParseObjectIdPipe} from "@nestjs/mongoose";
import {BaseQueryDto} from "../common/dto/query.dto";
import {ProductFilterDto} from "../common/dto/product-filter.dto";


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
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    async getAllUnitedProducts(@Query() query:ProductFilterDto) {
        return this.restProductService.getAllUnitedProducts(query);
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
