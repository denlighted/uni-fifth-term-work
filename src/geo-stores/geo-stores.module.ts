import { Module } from '@nestjs/common';
import { GeoStoresService } from './geo-stores.service';
import { GeoStoresController } from './geo-stores.controller';

@Module({
  controllers: [GeoStoresController],
  providers: [GeoStoresService],
})
export class GeoStoresModule {}
