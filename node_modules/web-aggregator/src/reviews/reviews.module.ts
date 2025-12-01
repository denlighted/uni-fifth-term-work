import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import * as Mongoose from "mongoose";
import {MongooseModule} from "@nestjs/mongoose";
import {use} from "passport";
import {ConfigService} from "@nestjs/config";
import {Review,ReviewSchema} from "./schemas/reviews.schema";
import {PrismaModule} from "../prisma/prisma.module";
import {ProductsModule} from "../products/products.module";
import {RestProductService} from "../products/services/rest-products.service";
import {AuthModule} from "../auth/auth.module";
import {UserPopulatingInterceptor} from "../common/interceptors/user-populating.interceptor";

@Module({
  imports:[MongooseModule.forRootAsync({
    useFactory:(config: ConfigService) => ({
      uri:config.getOrThrow<string>('DATABASE_URI'),
    }),
    inject: [ConfigService],
  }),
      MongooseModule.forFeature([
          { name: Review.name, schema: ReviewSchema },
      ]),
      PrismaModule,
      ProductsModule,
      AuthModule
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, RestProductService,UserPopulatingInterceptor],
})
export class ReviewsModule {}
