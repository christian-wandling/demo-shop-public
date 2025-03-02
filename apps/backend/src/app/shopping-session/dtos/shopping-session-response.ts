import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { CartItemResponse, toCartItemResponse } from '../../cart-item/dtos/cart-item-response';
import { batchConvert } from '../../common/util/batch-convert';
import { ApiResponseProperty } from '@nestjs/swagger';

export class ShoppingSessionResponse {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  userId: number;
  @ApiResponseProperty({ type: [CartItemResponse] })
  items: CartItemResponse[];
}

export const toShoppingSessionResponse = (shoppingSession: HydratedShoppingSession): ShoppingSessionResponse => {
  const items = batchConvert(shoppingSession.cart_items, toCartItemResponse);

  return {
    id: shoppingSession.id,
    userId: shoppingSession.user_id,
    items,
  };
};
