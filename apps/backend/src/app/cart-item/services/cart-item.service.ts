import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CartItemResponse, toCartItemResponse } from '../dtos/cart-item-response';
import { CartItemRepository } from './cart-item.repository';
import { UpdateCartItemQuantityRequest } from '../dtos/update-cart-item-quantity-request';
import { AddCartItemRequest } from '../dtos/add-cart-item-request';

/**
 * Service class for handling cart item business logic
 */
@Injectable()
export class CartItemService {
  constructor(private readonly cartItemRepository: CartItemRepository) {}

  /**
   * Creates a new cart item
   * @param dto - Data transfer object containing cart item creation information
   * @param shoppingSessionId - ID of the shopping session this item belongs to
   * @returns Promise resolving to the created cart item response
   * @throws BadRequestException if the cart item creation fails
   */
  async create(dto: AddCartItemRequest, shoppingSessionId: number): Promise<CartItemResponse> {
    const cartItem = await this.cartItemRepository.create(dto, shoppingSessionId);

    if (!cartItem) {
      throw new BadRequestException('Failed to create cart item');
    }

    return toCartItemResponse(cartItem);
  }

  /**
   * Updates the quantity of an existing cart item
   * @param id - ID of the cart item to update
   * @param dto - Data transfer object containing the new quantity
   * @param shoppingSessionId - ID of the shopping session this item belongs to
   * @returns Promise resolving to the updated cart item response
   * @throws NotFoundException if the cart item is not found
   */
  async update(id: number, dto: UpdateCartItemQuantityRequest, shoppingSessionId: number): Promise<CartItemResponse> {
    const cartItem = await this.cartItemRepository.update(id, dto, shoppingSessionId);

    if (!cartItem) {
      throw new NotFoundException(`Cart item not found`);
    }

    return toCartItemResponse(cartItem);
  }

  /**
   * Removes a cart item
   * @param id - ID of the cart item to remove
   * @param shoppingSessionId - ID of the shopping session this item belongs to
   * @throws NotFoundException if the cart item is not found
   */
  async remove(id: number, shoppingSessionId: number): Promise<void> {
    const cartItem = await this.cartItemRepository.remove(id, shoppingSessionId);

    if (!cartItem) {
      throw new NotFoundException(`Cart item not found`);
    }
  }
}
