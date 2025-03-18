import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { CartItemResponse, toCartItemResponse } from '../../cart-item/dtos/cart-item-response';
import { batchConvert } from '../../common/util/batch-convert';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for shopping session data
 * Represents the structure of shopping session data sent to clients
 */
export class ShoppingSessionResponse {
  /**
   * Unique identifier of the shopping session
   */
  @ApiProperty()
  id: number;

  /**
   * Identifier of the user who owns this shopping session
   */
  @ApiProperty()
  userId: number;

  /**
   * Collection of cart items contained in this shopping session
   */
  @ApiProperty({ type: [CartItemResponse] })
  items: CartItemResponse[];
}

/**
 * Converts a hydrated shopping session entity to a response DTO
 * @param shoppingSession The shopping session entity with related data
 * @returns A formatted ShoppingSessionResponse object ready to be sent to the client
 */
export const toShoppingSessionResponse = (shoppingSession: HydratedShoppingSession): ShoppingSessionResponse => {
  const items = batchConvert(shoppingSession.cart_items, toCartItemResponse);

  return {
    id: shoppingSession.id,
    userId: shoppingSession.user_id,
    items,
  };
};
