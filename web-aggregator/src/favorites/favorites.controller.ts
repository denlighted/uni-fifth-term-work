import {Body, Controller, Get, HttpCode, Post, Req, Res, Param, UseInterceptors} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import {Authorization} from "../auth/decorators";
import {FavoriteActionRequest} from "./dto";
import  type {Request} from "express";
import {User} from "@prisma/client";
import {UserPopulatingInterceptor} from "../common/interceptors/user-populating.interceptor";

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post("toggle")
  @Authorization()
  async toggleFavorite(@Body() dto: FavoriteActionRequest, @Req() req:Request,) {
    const currentUser = req.user as User
    return await this.favoritesService.toggleFavorite(dto,currentUser.id)
  }

  @Get('list')
  @Authorization()
  @UseInterceptors(UserPopulatingInterceptor)
  async getUserFavorites(@Req() req:Request){
    const currentUser = req.user as User
    return await this.favoritesService.getUserFavorites(currentUser.id)
  }

  @Get("is-favorite/:productId")
  @Authorization()
  async isFavorite(@Req() req:Request, @Param("productId") productId:string){
    const currentUser = req.user as User
    return await this.favoritesService.isFavorite(currentUser.id, productId)
  }

  @Get("count/:productId")
  @Authorization()
  async countFavorites(@Param("productId") productId:string){
      return await this.favoritesService.countFavorites(productId)
  }
}
