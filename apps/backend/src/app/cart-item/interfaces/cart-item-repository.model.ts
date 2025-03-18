import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { CartItem } from '@prisma/client';
import { UpdateCartItemQuantityRequest } from '../dtos/update-cart-item-quantity-request';
import { AddCartItemRequest } from '../dtos/add-cart-item-request';

/**
 * Repository interface for managing cart items in a shopping session.
 * Provides methods for creating, updating, and removing cart items.
 */
export interface CartItemRepositoryModel {
  /**
   * Creates a new cart item in the specified shopping session.
   *
   * @param item - The request object containing the product ID to add to the cart
   * @param shoppingSessionId - The ID of the shopping session to add the item to
   * @returns A promise that resolves to the newly created cart item with product details
   */
  create(item: AddCartItemRequest, shoppingSessionId: number): Promise<HydratedCartItem>;

  /**
   * Updates the quantity of an existing cart item in the specified shopping session.
   *
   * @param id - The ID of the cart item to update
   * @param dto - The request object containing the new quantity
   * @param shoppingSessionId - The ID of the shopping session that contains the cart item
   * @returns A promise that resolves to the updated cart item with product details
   */
  update(id: number, dto: UpdateCartItemQuantityRequest, shoppingSessionId: number): Promise<HydratedCartItem>;

  /**
   * Removes a cart item from the specified shopping session.
   *
   * @param id - The ID of the cart item to remove
   * @param shoppingSessionId - The ID of the shopping session that contains the cart item
   * @returns A promise that resolves to the removed cart item
   */
  remove(id: number, shoppingSessionId: number): Promise<CartItem>;
}
