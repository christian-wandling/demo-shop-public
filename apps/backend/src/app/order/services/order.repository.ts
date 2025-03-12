import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedOrder } from '../entities/hydrated-order';
import { OrderRepositoryModel } from '../models/order-repository.model';

@Injectable()
export class OrderRepository implements OrderRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  find(id: number, email: string): Promise<HydratedOrder> {
    return this.prisma.order.findUniqueOrThrow({
      where: {
        id,
        user: {
          email,
        },
      },
      include: {
        order_items: true,
      },
    });
  }

  findManyByUser(email: string): Promise<HydratedOrder[]> {
    return this.prisma.order.findMany({
      where: {
        user: {
          email,
        },
      },
      include: {
        order_items: true,
      },
    });
  }
}
