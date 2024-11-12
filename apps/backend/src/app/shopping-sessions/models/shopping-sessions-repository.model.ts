import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { ShoppingSession } from '@prisma/client';

export interface ShoppingSessionsRepositoryModel {
  find(email: string): Promise<HydratedShoppingSession>;
  create(email: string): Promise<HydratedShoppingSession>;
  remove(id: string, email: string): Promise<ShoppingSession>;
}
