import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CartItemResponse, toCartItemResponse } from '../dtos/cart-item-response';
import { CartItemRepository } from './cart-item.repository';
import { UpdateCartItemQuantityRequest } from '../dtos/update-cart-item-quantity-request';
import { AddCartItemRequest } from '../dtos/add-cart-item-request';

@Injectable()
export class CartItemService {
  constructor(private readonly cartItemRepository: CartItemRepository) {}

  async create(dto: AddCartItemRequest, shoppingSessionId: number): Promise<CartItemResponse> {
    const cartItem = await this.cartItemRepository.create(dto, shoppingSessionId);

    if (!cartItem) {
      throw new BadRequestException('Failed to create cart item');
    }

    return toCartItemResponse(cartItem);
  }

  async update(id: number, dto: UpdateCartItemQuantityRequest, shoppingSessionId: number): Promise<CartItemResponse> {
    const cartItem = await this.cartItemRepository.update(id, dto, shoppingSessionId);

    if (!cartItem) {
      throw new NotFoundException(`Cart item not found`);
    }

    return toCartItemResponse(cartItem);
  }

  async remove(id: number, shoppingSessionId: number): Promise<void> {
    const cartItem = await this.cartItemRepository.remove(id, shoppingSessionId);

    if (!cartItem) {
      throw new NotFoundException(`Cart item not found`);
    }
  }
}
