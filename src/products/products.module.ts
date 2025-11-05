import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigService} from "@nestjs/config";
import {ScrapedCategory, ScrapedCategorySchema, ScrapedProduct, ScrapedProductSchema} from "../scraper/schemas";
import {PrivateBrands, PrivateBrandsSchema} from "./schemas";

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
      {name:PrivateBrands.name, schema:PrivateBrandsSchema}
    ]),
  ],

  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
