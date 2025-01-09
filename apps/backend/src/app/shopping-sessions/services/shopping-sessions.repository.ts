import { Injectable } from '@nestjs/common';
import { ShoppingSession } from '@prisma/client';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { ShoppingSessionsRepositoryModel } from '../models/shopping-sessions-repository.model';

@Injectable()
export class ShoppingSessionsRepository implements ShoppingSessionsRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  find(email: string): Promise<HydratedShoppingSession> {
    return this.prisma.shoppingSession.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        user: {
          email,
        },
      },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  }

  create(email: string): Promise<HydratedShoppingSession> {
    return this.prisma.shoppingSession.create({
      data: {
        user: {
          connect: { email },
        },
      },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  }

  remove(id: number, email: string): Promise<ShoppingSession> {
    return this.prisma.shoppingSession.delete({
      where: {
        id,
        user: {
          email,
        },
      },
    });
  }
}
