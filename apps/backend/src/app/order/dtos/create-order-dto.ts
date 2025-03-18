import { IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item-dto';

/**
 * Data Transfer Object for creating a new order.
 */
export class CreateOrderDto {
  /**
   * Identifier for the shopping session associated with this order.
   * Must be a positive integer.
   */
  @IsInt()
  @Min(1)
  shoppingSessionId: number;

  /**
   * Identifier of the user placing the order.
   * Must be a positive integer.
   */
  @IsInt()
  @Min(1)
  userId: number;

  /**
   * Collection of items to be included in the order.
   * Each item must be a valid CreateOrderItemDto.
   */
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
