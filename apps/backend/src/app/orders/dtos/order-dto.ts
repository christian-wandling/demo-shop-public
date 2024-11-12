import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { OrderItemDTO, toOrderItemDTO } from './order-item-dto';
import { HydratedOrder } from '../entities/hydrated-order';
import { batchConvert } from '../../common/util/batch-convert';
import { $Enums } from '@prisma/client';
import { ArrayMinSize, IsDate, IsEnum, IsInt, IsNumber, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderDTO {
  @ApiResponseProperty()
  @MinLength(1)
  id: string;
  @ApiResponseProperty()
  @MinLength(1)
  userId: string;
  @ApiProperty({ isArray: true, type: OrderItemDTO, readOnly: true })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];
  @ApiResponseProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;
  @ApiProperty({ enum: $Enums.OrderStatus, enumName: 'OrderStatus', readOnly: true })
  @IsEnum($Enums.OrderStatus)
  status: $Enums.OrderStatus;
  @ApiResponseProperty()
  @IsDate()
  created: Date;
}

export const toOrderDto = (order: HydratedOrder): OrderDTO => {
  const items = batchConvert<OrderItemDTO>(order.items, toOrderItemDTO);
  const amount = order.items.reduce((acc, curr) => acc + curr.quantity * Number(curr.price), 0);

  return {
    id: order.id.toString(),
    userId: order.userId.toString(),
    items,
    amount,
    status: order.status,
    created: new Date(order.createdAt),
  };
};
