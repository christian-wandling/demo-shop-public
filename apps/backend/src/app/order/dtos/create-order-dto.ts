import { IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item-dto';

export class CreateOrderDto {
  @IsInt()
  @Min(1)
  shoppingSessionId: number;
  @IsInt()
  @Min(1)
  userId: number;
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
