import {Controller, Get, Req} from '@nestjs/common';
import { GeoStoresService } from './geo-stores.service';
import type{Request} from "express";
import {Authorization} from "../auth/decorators";
import {User} from "@prisma/client";

@Controller('geo-stores')
export class GeoStoresController {
  constructor(private readonly geoStoresService: GeoStoresService) {}

  // @Get('test/atb')
  // async getStoresAtb(@Req() req:Request){
  //   return this.geoStoresService.getAtbSupermarkets(req);
  // }
  //
  // @Get('test/fora')
  // async getStoresFora(@Req() req:Request){
  //   return this.geoStoresService.getForaSupermarkets(req)
  // }

  @Authorization()
  @Get('stores')
  async getSupermarketsGeo(@Req() req:Request){
    const currentUser = req.user as User;
    return this.geoStoresService.getSupermarketsGeo(currentUser.id)
  }

}
