import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedOrder } from '../entities/hydrated-order';
import { ShoppingSessionDTO } from '../../shopping-sessions/dtos/shopping-session-dto';
import { OrdersRepositoryModel } from '../models/orders-repository.model';

@Injectable()
export class OrdersRepository implements OrdersRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  find(id: number, email: string): Promise<HydratedOrder> {
    return this.prisma.order.findUniqueOrThrow({
      where: {
        id: Number(id),
        user: {
          email,
        },
      },
      include: {
        items: true,
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
        items: true,
      },
    });
  }

  async createFromShoppingSession(dto: ShoppingSessionDTO): Promise<HydratedOrder> {
    const [hydratedOrder] = await this.prisma.$transaction([
      this.prisma.order.create({
        data: {
          user: {
            connect: { id: Number(dto.userId) },
          },
          items: {
            createMany: {
              data: dto.items.map(item => ({
                productId: Number(item.productId),
                productName: item.productName,
                productThumbnail: item.productThumbnail,
                quantity: item.quantity,
                price: item.unitPrice,
              })),
            },
          },
          status: 'CREATED',
        },
        include: {
          items: true,
        },
      }),
      this.prisma.shoppingSession.delete({
        where: {
          id: Number(dto.id),
        },
      }),
    ]);

    return hydratedOrder;
  }
}
