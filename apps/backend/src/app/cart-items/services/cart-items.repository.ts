import { Injectable } from '@nestjs/common';
import { CartItem } from '@prisma/client';
import { PrismaService } from '../../common/services/prisma.service';
import { CreateCartItemDTO, UpdateCartItemDTO } from '../dtos/cart-item-dto';
import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { CartItemsRepositoryModel } from '../models/cart-items-repository.model';

@Injectable()
export class CartItemsRepository implements CartItemsRepositoryModel {
  constructor(private prisma: PrismaService) {}

  create(item: CreateCartItemDTO, shoppingSessionId: string): Promise<HydratedCartItem> {
    return this.prisma.cartItem.create({
      data: {
        quantity: 1,
        product: {
          connect: {
            id: Number(item.productId),
          },
        },
        shoppingSession: {
          connect: {
            id: Number(shoppingSessionId),
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

  update(id: string, dto: UpdateCartItemDTO, shoppingSessionId: string): Promise<HydratedCartItem> {
    return this.prisma.cartItem.update({
      where: {
        id: Number(id),
        shoppingSessionId: Number(shoppingSessionId),
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

  remove(id: string, shoppingSessionId: string): Promise<CartItem> {
    return this.prisma.cartItem.delete({
      where: {
        id: Number(id),
        shoppingSessionId: Number(shoppingSessionId),
      },
    });
  }
}
