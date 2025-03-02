import { Injectable } from '@nestjs/common';
import { CartItem } from '@prisma/client';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { CartItemRepositoryModel } from '../models/cart-item-repository.model';
import { UpdateCartItemQuantityRequest } from '../dtos/update-cart-item-quantity-request';
import { AddCartItemRequest } from '../dtos/add-cart-item-request';

@Injectable()
export class CartItemRepository implements CartItemRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

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
            images: true,
          },
        },
      },
    });
  }

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
            images: true,
          },
        },
      },
    });
  }

  remove(id: number, shoppingSessionId: number): Promise<CartItem> {
    return this.prisma.cartItem.delete({
      where: {
        id,
        shopping_session_id: shoppingSessionId,
      },
    });
  }
}
