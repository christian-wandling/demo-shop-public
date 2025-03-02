import { OrderItemResponse, toOrderItemResponse } from './order-item-response';
import { HydratedOrder } from '../entities/hydrated-order';
import { batchConvert } from '../../common/util/batch-convert';
import { $Enums } from '@prisma/client';
import { ApiResponseProperty } from '@nestjs/swagger';

export class OrderResponse {
  @ApiResponseProperty()
  readonly id: number;
  @ApiResponseProperty()
  readonly userId: number;
  @ApiResponseProperty({ type: [OrderItemResponse] })
  readonly items: OrderItemResponse[];
  @ApiResponseProperty()
  readonly amount: number;
  @ApiResponseProperty({ enum: $Enums.OrderStatus })
  readonly status: $Enums.OrderStatus;
  @ApiResponseProperty()
  readonly created: Date;
}

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
