import {Body, Controller, Delete, Get, Param, Post, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import {ProductsService} from './services/products.service';
import type {PrivateBrandsRequest} from "./dto";
import {RestProductService} from "./services/rest-products.service";
import {ParseObjectIdPipe} from "@nestjs/mongoose";
import {BaseQueryDto} from "../common/dto/query.dto";
import {ProductFilterDto} from "../common/dto/product-filter.dto";
import {TransformNestQueryPipe} from "../common/pipes/transform-nested-query.pipe";
import {Authorization} from "../auth/decorators";
import {RoleEnum} from "@prisma/client";


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
    async getAllUnitedProducts(
        @Query(new TransformNestQueryPipe()) query: any
    ) {
        return this.restProductService.getAllUnitedProducts(query);
    }

    @Get("search")
    async getSearchedProducts(@Query(new TransformNestQueryPipe()) query: any) {
        return this.restProductService.getSearchedProducts(query)
    }

    @Get('profile/:slug')
    async getUnitedProductBySlug(@Param('slug') slug: string) {
        return this.restProductService.getUnitedProductBySlug(slug);
    }

    @Get('id/:id')
    async getUnitedProductById(@Param('id', new ParseObjectIdPipe()) id: string) {
        return this.restProductService.getUnitedProductById(id);
    }

    @Delete("product-delete/:productId")
    @Authorization(RoleEnum.ADMIN)
    async deleteProductById(@Param('productId') productId: string) {
        return this.restProductService.deleteProductById(productId)
    }

    @Delete("clear-matched-products")
    @Authorization(RoleEnum.ADMIN)
    async deleteAllMatchedProds(){
        return this.restProductService.deleteAllMatchedProds();
    }

    /// Test method for brand checking

    @Get('test')
    async test() {
        return this.productsService.testBrand();
    }
}
