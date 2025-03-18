import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

/**
 * Request class for updating the quantity of an item in the shopping cart.
 * Contains the new quantity value that should be applied to the cart item.
 */
export class UpdateCartItemQuantityRequest {
  /**
   * The new quantity to set for the cart item.
   * Must be a positive integer (minimum value of 1).
   */
  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;
}
