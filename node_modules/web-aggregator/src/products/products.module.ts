import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './products.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigService} from "@nestjs/config";
import {ScrapedCategory, ScrapedCategorySchema, ScrapedProduct, ScrapedProductSchema} from "../scraper/schemas";
import {
  PrivateBrands,
  PrivateBrandsSchema,
  UnitedCategories,
  UnitedCategoriesSchema,
  UnitedProducts,
  UnitedProductsSchema
} from "./schemas";
import {RestProductService} from "./services/rest-products.service";

@Module({
  imports:[MongooseModule.forRootAsync({
    useFactory: (config: ConfigService) => ({
      uri: config.getOrThrow<string>('DATABASE_URI'),
    }),
    inject: [ConfigService],
  }),
    MongooseModule.forFeature([
      { name: ScrapedProduct.name, schema: ScrapedProductSchema },
      { name: ScrapedCategory.name, schema: ScrapedCategorySchema },
      {name:PrivateBrands.name, schema:PrivateBrandsSchema},
      {name:UnitedCategories.name, schema:UnitedCategoriesSchema},
      {name:UnitedProducts.name, schema:UnitedProductsSchema},
    ]),
  ],

  controllers: [ProductsController],
  providers: [ProductsService,RestProductService],
  exports:[MongooseModule,ProductsModule]
})
export class ProductsModule {}
