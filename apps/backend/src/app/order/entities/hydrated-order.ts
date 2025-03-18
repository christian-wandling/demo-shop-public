import { Prisma } from '@prisma/client';

/**
 * Represents a fully hydrated Order with included order items.
 *
 * This type extends the base Prisma Order model by ensuring that
 * the order_items relationship is always loaded and available.
 */
export type HydratedOrder = Prisma.OrderGetPayload<{
  include: {
    order_items: true;
  };
}>;
