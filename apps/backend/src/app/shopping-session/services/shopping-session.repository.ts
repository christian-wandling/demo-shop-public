import { Injectable } from '@nestjs/common';
import { ShoppingSession } from '@prisma/client';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { ShoppingSessionRepositoryModel } from '../models/shopping-session-repository.model';
import { CreateOrderDto } from '../../order/dtos/create-order-dto';
import { HydratedOrder } from '../../order/entities/hydrated-order';

@Injectable()
export class ShoppingSessionRepository implements ShoppingSessionRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  find(keycloakId: string): Promise<HydratedShoppingSession> {
    return this.prisma.shoppingSession.findFirst({
      orderBy: {
        created_at: 'desc',
      },
      where: {
        user: {
          keycloak_user_id: keycloakId,
        },
      },
      include: {
        cart_items: {
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
        },
      },
    });
  }

  create(keycloakId: string): Promise<HydratedShoppingSession> {
    return this.prisma.shoppingSession.create({
      data: {
        user: {
          connect: { keycloak_user_id: keycloakId },
        },
      },
      include: {
        cart_items: {
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
        },
      },
    });
  }

  remove(id: number, keycloakId: string): Promise<ShoppingSession> {
    return this.prisma.shoppingSession.delete({
      where: {
        id,
        user: {
          keycloak_user_id: keycloakId,
        },
      },
    });
  }

  async checkout(dto: CreateOrderDto): Promise<HydratedOrder> {
    const [hydratedOrder] = await this.prisma.$transaction([
      this.prisma.order.create({
        data: {
          user: {
            connect: { id: dto.userId },
          },
          order_items: {
            createMany: {
              data: dto.items,
            },
          },
          status: 'Created',
        },
        include: {
          order_items: {
            where: {
              deleted: false,
            },
          },
        },
      }),
      this.prisma.shoppingSession.delete({
        where: {
          id: dto.shoppingSessionId,
        },
      }),
    ]);

    return hydratedOrder;
  }
}
