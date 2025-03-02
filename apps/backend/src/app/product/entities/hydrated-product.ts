import { Prisma } from '@prisma/client';

export type HydratedProduct = Prisma.ProductGetPayload<{
  include: {
    categories: {
      include: {
        category: true;
      };
    };
    images: true;
  };
}>;
