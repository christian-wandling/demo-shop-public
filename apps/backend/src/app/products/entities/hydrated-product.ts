import { Prisma } from '@prisma/client';

export type HydratedProduct = Prisma.ProductGetPayload<{
  include: {
    categories: true;
    images: true;
  };
}>;
