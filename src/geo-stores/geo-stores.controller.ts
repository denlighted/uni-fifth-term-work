import {Controller, Get, Req} from '@nestjs/common';
import { GeoStoresService } from './geo-stores.service';
import type{Request} from "express";
import {Authorization} from "../auth/decorators";

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
    return this.geoStoresService.getSupermarketsGeo(req)
  }

}
