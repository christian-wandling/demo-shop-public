import { OrderResponse } from './order-response';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Response object containing a collection of orders.
 * Used for endpoints that return multiple order records.
 */
export class OrderListResponse {
  /**
   * Array of order response objects.
   * Each item contains the complete details of an individual order.
   */
  @ApiProperty({ type: [OrderResponse] })
  items: OrderResponse[];
}
