import { Module } from '@nestjs/common';
import { GeoStoresService } from './geo-stores.service';
import { GeoStoresController } from './geo-stores.controller';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports:[PrismaModule],
  controllers: [GeoStoresController],
  providers: [GeoStoresService]
})
export class GeoStoresModule {}
