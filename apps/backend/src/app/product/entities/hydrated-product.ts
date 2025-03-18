import { Prisma } from '@prisma/client';

/**
 * Represents a product with its related categories and images hydrated from the database.
 *
 * This type uses Prisma's GetPayload utility to define the shape of a product that includes:
 * - The product's basic fields
 * - Associated categories, with each category's details included
 * - All related product images
 */
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
