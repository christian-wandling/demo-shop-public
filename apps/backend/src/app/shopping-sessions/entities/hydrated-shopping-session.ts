import { Prisma } from '@prisma/client';

export type HydratedShoppingSession = Prisma.ShoppingSessionGetPayload<{
  include: {
    cartItems: {
      include: {
        product: {
          include: {
            images: true;
          };
        };
      };
    };
  };
}>;
