import { Prisma } from '@prisma/client';

export type HydratedCartItem = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        images: true;
      };
    };
  };
}>;
