import { Injectable } from '@nestjs/common';
import { CartItem } from '@prisma/client';
import { PrismaService } from '../../common/services/prisma.service';
import { CreateCartItemDTO, UpdateCartItemDTO } from '../dtos/cart-item-dto';
import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { CartItemsRepositoryModel } from '../models/cart-items-repository.model';

@Injectable()
export class CartItemsRepository implements CartItemsRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  create(item: CreateCartItemDTO, shoppingSessionId: number): Promise<HydratedCartItem> {
    return this.prisma.cartItem.create({
      data: {
        quantity: 1,
        product: {
          connect: {
            id: item.productId,
          },
        },
        shoppingSession: {
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

  update(id: number, dto: UpdateCartItemDTO, shoppingSessionId: number): Promise<HydratedCartItem> {
    return this.prisma.cartItem.update({
      where: {
        id,
        shoppingSessionId,
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
        shoppingSessionId,
      },
    });
  }
}
