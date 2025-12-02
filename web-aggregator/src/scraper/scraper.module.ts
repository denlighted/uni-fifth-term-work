import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import {ConfigModule, ConfigService} from "@nestjs/config";


import {MongooseModule} from "@nestjs/mongoose";
import {ScrapedProduct, ScrapedProductSchema} from "./schemas";
import {ScrapedCategory, ScrapedCategorySchema} from "./schemas";
import {AtbScraper,ForaScraper} from "./scrapers";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScrapedProduct.name, schema: ScrapedProductSchema },
      { name: ScrapedCategory.name, schema: ScrapedCategorySchema },
    ]),
  ],
  controllers: [ScraperController],
  providers: [ScraperService, AtbScraper, ForaScraper],
})
export class ScraperModule {}
