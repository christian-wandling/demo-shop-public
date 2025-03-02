import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedOrder } from '../entities/hydrated-order';
import { OrderRepositoryModel } from '../models/order-repository.model';
import { CreateOrderDto } from '../dtos/create-order-dto';

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

  async create(dto: CreateOrderDto): Promise<HydratedOrder> {
    const [hydratedOrder] = await this.prisma.$transaction([
      this.prisma.order.create({
        data: {
          user: {
            connect: { id: dto.userId },
          },
          order_items: {
            createMany: {
              data: dto.items.map(item => ({
                product_id: item.productId,
                product_name: item.productName,
                product_thumbnail: item.productThumbnail,
                quantity: item.quantity,
                price: item.unitPrice,
              })),
            },
          },
          status: 'Created',
        },
        include: {
          order_items: true,
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
