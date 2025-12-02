import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigService} from "@nestjs/config";
import {FavoriteProducts, FavoriteProductSchema} from "./schemas/favorite-products.schema";
import {PrismaModule} from "../prisma/prisma.module";
import {ProductsModule} from "../products/products.module";
import {AuthModule} from "../auth/auth.module";
import {UserPopulatingInterceptor} from "../common/interceptors/user-populating.interceptor";

@Module({
  imports:[
      MongooseModule.forFeature([
          {name:FavoriteProducts.name,schema:FavoriteProductSchema}
      ]),
    PrismaModule,
    ProductsModule,
    AuthModule
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService,UserPopulatingInterceptor],
})
export class FavoritesModule {}
