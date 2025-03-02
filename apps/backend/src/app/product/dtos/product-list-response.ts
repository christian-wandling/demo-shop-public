import { ProductResponse } from './product-response';
import { ApiResponseProperty } from '@nestjs/swagger';

export class ProductListResponse {
  @ApiResponseProperty({ type: [ProductResponse] })
  readonly items: ProductResponse[];
}
