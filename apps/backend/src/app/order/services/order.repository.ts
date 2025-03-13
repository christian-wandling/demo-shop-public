import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedOrder } from '../entities/hydrated-order';
import { OrderRepositoryModel } from '../models/order-repository.model';

@Injectable()
export class OrderRepository implements OrderRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  find(id: number, keycloakId: string): Promise<HydratedOrder> {
    return this.prisma.order.findUniqueOrThrow({
      where: {
        id,
        user: {
          keycloak_user_id: keycloakId,
        },
      },
      include: {
        order_items: true,
      },
    });
  }

  findManyByUser(keycloakId: string): Promise<HydratedOrder[]> {
    return this.prisma.order.findMany({
      where: {
        user: {
          keycloak_user_id: keycloakId,
        },
      },
      include: {
        order_items: true,
      },
    });
  }
}
