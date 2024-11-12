import { CreateCartItemDTO, UpdateCartItemDTO } from '../dtos/cart-item-dto';
import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { CartItem } from '@prisma/client';

export interface CartItemsRepositoryModel {
  create(item: CreateCartItemDTO, shoppingSessionId: string): Promise<HydratedCartItem>;

  update(id: string, dto: UpdateCartItemDTO, shoppingSessionId: string): Promise<HydratedCartItem>;

  remove(id: string, shoppingSessionId: string): Promise<CartItem>;
}
