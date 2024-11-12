import { Prisma } from '@prisma/client';

export type HydratedUser = Prisma.UserGetPayload<{
  include: {
    address: true;
  };
}>;
