import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CartItemDTO, CreateCartItemDTO, toCartItemDto, UpdateCartItemDTO } from '../dtos/cart-item-dto';
import { CartItemsRepository } from './cart-items.repository';

@Injectable()
export class CartItemsService {
  constructor(private readonly cartItemRepository: CartItemsRepository) {}

  async create(dto: CreateCartItemDTO, shoppingSessionId: number): Promise<CartItemDTO> {
    const cartItem = await this.cartItemRepository.create(dto, shoppingSessionId);

    if (!cartItem) {
      throw new BadRequestException('Failed to create cart item');
    }

    return toCartItemDto(cartItem);
  }

  async update(id: number, dto: UpdateCartItemDTO, shoppingSessionId: number): Promise<CartItemDTO> {
    const cartItem = await this.cartItemRepository.update(id, dto, shoppingSessionId);

    if (!cartItem) {
      throw new NotFoundException(`Cart item not found`);
    }

    return toCartItemDto(cartItem);
  }

  async remove(id: number, shoppingSessionId: number): Promise<void> {
    const cartItem = await this.cartItemRepository.remove(id, shoppingSessionId);

    if (!cartItem) {
      throw new NotFoundException(`Cart item not found`);
    }
  }
}
