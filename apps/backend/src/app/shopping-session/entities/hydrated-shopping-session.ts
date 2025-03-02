import { Prisma } from '@prisma/client';

export type HydratedShoppingSession = Prisma.ShoppingSessionGetPayload<{
  include: {
    cart_items: {
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
