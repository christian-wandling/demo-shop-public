import { Injectable } from '@nestjs/common';
import { ShoppingSession } from '@prisma/client';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { ShoppingSessionRepositoryModel } from '../interfaces/shopping-session-repository.model';
import { CreateOrderDto } from '../../order/dtos/create-order-dto';
import { HydratedOrder } from '../../order/entities/hydrated-order';

/**
 * Repository class for managing shopping sessions.
 * Implements the ShoppingSessionRepositoryModel interface.
 * Handles interactions with the database for shopping session operations.
 */
@Injectable()
export class ShoppingSessionRepository implements ShoppingSessionRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds the most recent shopping session for a user by their Keycloak ID.
   * Returns a fully hydrated shopping session with cart items and product details.
   *
   * @param keycloakId - The Keycloak user identifier
   * @returns Promise resolving to the hydrated shopping session
   */
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

  /**
   * Creates a new shopping session for a user.
   *
   * @param keycloakId - The Keycloak user identifier
   * @returns Promise resolving to the newly created hydrated shopping session
   */
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

  /**
   * Removes a shopping session by its ID and user's Keycloak ID.
   * Ensures that users can only remove their own shopping sessions.
   *
   * @param id - The shopping session ID
   * @param keycloakId - The Keycloak user identifier
   * @returns Promise resolving to the deleted shopping session
   */
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

  /**
   * Processes checkout by creating an order from the shopping session items
   * and deleting the shopping session in a single transaction.
   *
   * @param dto - Data transfer object containing checkout information
   * @returns Promise resolving to the hydrated order
   */
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
