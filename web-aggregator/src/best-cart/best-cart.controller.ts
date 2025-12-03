import {Body, Controller, Get, Param, Post, Req} from '@nestjs/common';
import { BestCartService } from './best-cart.service';
import {Authorization} from "../auth/decorators";
import type{Request} from 'express';
import {User} from "@prisma/client";
import {CartedProductsRequest} from "./dto/carted-products.dto";

@Controller('best-cart')
export class BestCartController {
  constructor(private readonly bestCartService: BestCartService) {}

  @Get('list')
  @Authorization()
  async getUserCarted(@Req() req:Request){

    const currentUser = req.user as User;

    return await this.bestCartService.getUserCarted(currentUser.id);
  }

  @Get("is-carted/:productId")
  @Authorization()
  async isCarted( @Param("productId") productId:string,@Req() req:Request){
    const currentUser = req.user as User;
    return await this.bestCartService.isCarted(currentUser.id,productId);
  }

  @Get("cheapest-shop")
  @Authorization()
  async calculateBestBasket(@Req() req:Request){
    const currentUser = req.user as User;
    return await this.bestCartService.calculateBestBasket(currentUser.id);
  }

  @Post('toggle')
  @Authorization()
  async toggleCart(@Body() dto:CartedProductsRequest,@Req() req:Request){
    const currentUser = req.user as User;
    return await this.bestCartService.toggleCart(currentUser.id,dto);
  }

}
