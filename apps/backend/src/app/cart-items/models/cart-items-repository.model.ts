import { CreateCartItemDTO, UpdateCartItemDTO } from '../dtos/cart-item-dto';
import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { CartItem } from '@prisma/client';

export interface CartItemsRepositoryModel {
  create(item: CreateCartItemDTO, shoppingSessionId: number): Promise<HydratedCartItem>;

  update(id: number, dto: UpdateCartItemDTO, shoppingSessionId: number): Promise<HydratedCartItem>;

  remove(id: number, shoppingSessionId: number): Promise<CartItem>;
}
