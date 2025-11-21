import { Controller } from '@nestjs/common';
import { ProductComparisonService } from './product-comparison.service';

@Controller('product-comparison')
export class ProductComparisonController {
  constructor(private readonly productComparisonService: ProductComparisonService) {}
}
