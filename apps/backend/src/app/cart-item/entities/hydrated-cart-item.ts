import { Prisma } from '@prisma/client';

/**
 * Represents a cart item with hydrated related data from the database.
 *
 * This type extends the basic CartItem with nested related entities using Prisma's
 * payload type generation. It includes the associated product data and its images,
 * providing a complete representation of a cart item for display or processing.
 */
export type HydratedCartItem = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        images: true;
      };
    };
  };
}>;
