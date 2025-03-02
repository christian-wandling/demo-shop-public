import { Injectable } from '@nestjs/common';
import { ShoppingSession } from '@prisma/client';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { ShoppingSessionRepositoryModel } from '../models/shopping-session-repository.model';

@Injectable()
export class ShoppingSessionRepository implements ShoppingSessionRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  find(email: string): Promise<HydratedShoppingSession> {
    return this.prisma.shoppingSession.findFirst({
      orderBy: {
        created_at: 'desc',
      },
      where: {
        user: {
          email,
        },
      },
      include: {
        cart_items: {
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
        cart_items: {
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
