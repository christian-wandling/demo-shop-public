import { Prisma } from '@prisma/client';

/**
 * Represents a fully hydrated User entity that includes the address relationship.
 * This type is automatically generated from Prisma's UserGetPayload type
 * with the address field included in the response.
 */
export type HydratedUser = Prisma.UserGetPayload<{
  include: {
    address: true;
  };
}>;
