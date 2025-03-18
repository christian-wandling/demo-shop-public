import { Injectable } from '@nestjs/common';
import { CartItem } from '@prisma/client';
import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { CartItemRepositoryModel } from '../interfaces/cart-item-repository.model';
import { UpdateCartItemQuantityRequest } from '../dtos/update-cart-item-quantity-request';
import { AddCartItemRequest } from '../dtos/add-cart-item-request';
import { PrismaService } from '../../common/services/prisma.service';

/**
 * Repository class for managing cart items in the database
 * Implements the CartItemRepositoryModel interface
 */
@Injectable()
export class CartItemRepository implements CartItemRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new cart item in the database
   * @param item - The cart item data containing product information
   * @param shoppingSessionId - The ID of the shopping session this item belongs to
   * @returns A Promise resolving to the created cart item with product details
   */
  create(item: AddCartItemRequest, shoppingSessionId: number): Promise<HydratedCartItem> {
    return this.prisma.cartItem.create({
      data: {
        quantity: 1,
        product: {
          connect: {
            id: item.productId,
          },
        },
        shopping_session: {
          connect: {
            id: shoppingSessionId,
          },
        },
      },
      include: {
        product: {
          include: {
            images: {
              where: {
                deleted: false,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Updates the quantity of an existing cart item
   * @param id - The ID of the cart item to update
   * @param dto - The data transfer object containing the new quantity
   * @param shoppingSessionId - The ID of the shopping session this item belongs to
   * @returns A Promise resolving to the updated cart item with product details
   */
  update(id: number, dto: UpdateCartItemQuantityRequest, shoppingSessionId: number): Promise<HydratedCartItem> {
    return this.prisma.cartItem.update({
      where: {
        id,
        shopping_session_id: shoppingSessionId,
      },
      data: {
        quantity: dto.quantity,
      },
      include: {
        product: {
          include: {
            images: {
              where: {
                deleted: false,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Removes a cart item from the database
   * @param id - The ID of the cart item to remove
   * @param shoppingSessionId - The ID of the shopping session this item belongs to
   * @returns A Promise resolving to the deleted cart item
   */
  remove(id: number, shoppingSessionId: number): Promise<CartItem> {
    return this.prisma.cartItem.delete({
      where: {
        id,
        shopping_session_id: shoppingSessionId,
      },
    });
  }
}
