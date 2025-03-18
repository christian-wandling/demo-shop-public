import { OrderItemResponse, toOrderItemResponse } from './order-item-response';
import { HydratedOrder } from '../entities/hydrated-order';
import { batchConvert } from '../../common/util/batch-convert';
import { $Enums } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Response object representing a complete order with its details and items.
 */
export class OrderResponse {
  /**
   * Unique identifier of the order.
   */
  @ApiProperty()
  readonly id: number;

  /**
   * Identifier of the user who placed the order.
   */
  @ApiProperty()
  readonly userId: number;

  /**
   * Collection of items included in this order.
   */
  @ApiProperty({ type: [OrderItemResponse] })
  readonly items: OrderItemResponse[];

  /**
   * Total monetary amount of the order.
   */
  @ApiProperty()
  readonly amount: number;

  /**
   * Current status of the order (e.g., PENDING, COMPLETED, CANCELLED).
   */
  @ApiProperty({ enum: $Enums.OrderStatus, enumName: 'OrderStatus', readOnly: true })
  readonly status: $Enums.OrderStatus;

  /**
   * Date and time when the order was created.
   */
  @ApiProperty()
  readonly created: Date;
}

/**
 * Converts a hydrated Order entity to an OrderResponse DTO.
 * Calculates the total amount based on all order items.
 *
 * @param order - The hydrated order entity to convert
 * @returns An OrderResponse object with calculated fields
 */
export const toOrderResponse = (order: HydratedOrder): OrderResponse => {
  const items = batchConvert<OrderItemResponse>(order.order_items, toOrderItemResponse);
  const amount = order.order_items.reduce((acc, curr) => acc + curr.quantity * Number(curr.price), 0);

  return {
    id: order.id,
    userId: order.user_id,
    items,
    amount,
    status: order.status,
    created: new Date(order.created_at),
  };
};
