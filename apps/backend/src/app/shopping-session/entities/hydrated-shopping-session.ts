import { Prisma } from '@prisma/client';

/**
 * Type definition for a fully hydrated shopping session
 * Represents a shopping session with all its related data loaded from the database
 *
 * Includes:
 * - The shopping session itself
 * - All cart items in the session
 * - The product details for each cart item
 * - Image data for each product
 */
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
