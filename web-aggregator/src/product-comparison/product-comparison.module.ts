import { Module } from '@nestjs/common';
import { ProductComparisonService } from './product-comparison.service';
import { ProductComparisonController } from './product-comparison.controller';

@Module({
  controllers: [ProductComparisonController],
  providers: [ProductComparisonService],
})
export class ProductComparisonModule {}
