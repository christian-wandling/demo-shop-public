import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { ShoppingSession } from '@prisma/client';

export interface ShoppingSessionRepositoryModel {
  find(email: string): Promise<HydratedShoppingSession>;
  create(email: string): Promise<HydratedShoppingSession>;
  remove(id: number, email: string): Promise<ShoppingSession>;
}
