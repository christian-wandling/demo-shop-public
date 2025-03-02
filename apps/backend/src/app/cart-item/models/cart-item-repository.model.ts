import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { CartItem } from '@prisma/client';
import { UpdateCartItemQuantityRequest } from '../dtos/update-cart-item-quantity-request';
import { AddCartItemRequest } from '../dtos/add-cart-item-request';

export interface CartItemRepositoryModel {
  create(item: AddCartItemRequest, shoppingSessionId: number): Promise<HydratedCartItem>;

  update(id: number, dto: UpdateCartItemQuantityRequest, shoppingSessionId: number): Promise<HydratedCartItem>;

  remove(id: number, shoppingSessionId: number): Promise<CartItem>;
}
