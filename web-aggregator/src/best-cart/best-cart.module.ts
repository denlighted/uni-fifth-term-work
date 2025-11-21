import { Module } from '@nestjs/common';
import { BestCartService } from './best-cart.service';
import { BestCartController } from './best-cart.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigService} from "@nestjs/config";
import {PrismaModule} from "../prisma/prisma.module";
import {ProductsModule} from "../products/products.module";
import {AuthModule} from "../auth/auth.module";
import {BestCart, BestCartSchema} from "./schemas/best-cart.schema";
import {UserPopulatingInterceptor} from "../common/interceptors/user-populating.interceptor";
import {RestProductService} from "../products/services/rest-products.service";

@Module({
  imports:[MongooseModule.forRootAsync({
    useFactory: (config:ConfigService) => ({
      uri:config.getOrThrow<string>('DATABASE_URI'),
    }),
    inject: [ConfigService],
  }),
    MongooseModule.forFeature([
      {name:BestCart.name,schema:BestCartSchema}
    ]),
    PrismaModule,
    ProductsModule,
    AuthModule,

  ],
  controllers: [BestCartController],
  providers: [BestCartService,UserPopulatingInterceptor,RestProductService],
})
export class BestCartModule {}
