import {Controller, Get} from '@nestjs/common';
import { GeoStoresService } from './geo-stores.service';

@Controller('geo-stores')
export class GeoStoresController {
  constructor(private readonly geoStoresService: GeoStoresService) {}

  @Get('test')
  async getStoresGeo(){
    return this.geoStoresService.getSupermarkets();
  }
}
