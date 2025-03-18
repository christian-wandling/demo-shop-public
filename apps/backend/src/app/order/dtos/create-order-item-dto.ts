import { IsDecimal, IsInt, Min, MinLength } from 'class-validator';

/**
 * Data Transfer Object for creating a new order item within an order.
 */
export class CreateOrderItemDto {
  /**
   * Identifier of the product for this order item.
   * Must be a positive integer.
   */
  @IsInt()
  @Min(1)
  product_id: number;

  /**
   * Name of the product for this order item.
   * Must contain at least one character.
   */
  @MinLength(1)
  product_name: string;

  /**
   * URL or path to the product's thumbnail image.
   * Must contain at least one character.
   */
  @MinLength(1)
  product_thumbnail: string;

  /**
   * Quantity of the product being ordered.
   * Must be a positive integer.
   */
  @IsInt()
  @Min(1)
  quantity: number;

  /**
   * Price per unit of the product.
   * Must be a positive decimal number with a minimum value of 0.01.
   */
  @IsDecimal()
  @Min(0.01)
  price: number;
}
