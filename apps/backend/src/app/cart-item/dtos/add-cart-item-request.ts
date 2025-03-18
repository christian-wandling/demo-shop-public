import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

/**
 * Request object for adding an item to the shopping cart.
 * Contains the necessary product information to identify the item being added.
 */
export class AddCartItemRequest {
  /**
   * The unique identifier of the product to add to the cart.
   * Must be a positive integer greater than or equal to 1.
   */
  @ApiProperty()
  @IsInt()
  @Min(1)
  productId: number;
}
