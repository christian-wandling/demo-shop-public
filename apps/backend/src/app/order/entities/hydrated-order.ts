import { Prisma } from '@prisma/client';

export type HydratedOrder = Prisma.OrderGetPayload<{
  include: {
    order_items: true;
  };
}>;
