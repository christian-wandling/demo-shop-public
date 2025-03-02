import { OrderResponse } from './order-response';
import { ApiResponseProperty } from '@nestjs/swagger';

export class OrderListResponse {
  @ApiResponseProperty({ type: [OrderResponse] })
  items: OrderResponse[];
}
