import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedOrder } from '../entities/hydrated-order';
import { OrderRepositoryModel } from '../interfaces/order-repository.model';

/**
 * Implementation of the OrderRepositoryModel interface.
 *
 * This repository class handles data access operations for orders using Prisma ORM.
 */
@Injectable()
export class OrderRepository implements OrderRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves a specific order by its ID and the Keycloak ID of the user.
   * Only returns non-deleted orders with their non-deleted order items.
   *
   * @param id - The unique identifier of the order to find
   * @param keycloakId - The Keycloak ID of the user who owns the order
   * @returns A promise that resolves to a hydrated order with its order items included
   * @throws Will throw an error if the order is not found
   */
  find(id: number, keycloakId: string): Promise<HydratedOrder> {
    return this.prisma.order.findUniqueOrThrow({
      where: {
        id,
        user: {
          keycloak_user_id: keycloakId,
        },
        deleted: false,
      },
      include: {
        order_items: {
          where: {
            deleted: false,
          },
        },
      },
    });
  }

  /**
   * Retrieves all orders associated with a specific user by their Keycloak ID.
   * Only returns non-deleted orders with their non-deleted order items.
   *
   * @param keycloakId - The Keycloak ID of the user whose orders to retrieve
   * @returns A promise that resolves to an array of hydrated orders with their order items included
   */
  findManyByUser(keycloakId: string): Promise<HydratedOrder[]> {
    return this.prisma.order.findMany({
      where: {
        user: {
          keycloak_user_id: keycloakId,
        },
        deleted: false,
      },
      include: {
        order_items: {
          where: {
            deleted: false,
          },
        },
      },
    });
  }
}
