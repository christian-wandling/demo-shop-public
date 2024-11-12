import { HydratedOrder } from '../entities/hydrated-order';
import { ShoppingSessionDTO } from '../../shopping-sessions/dtos/shopping-session-dto';

export interface OrdersRepositoryModel {
  find(id: string, email: string): Promise<HydratedOrder>;

  findManyByUser(email: string): Promise<HydratedOrder[]>;

  createFromShoppingSession(shoppingSession: ShoppingSessionDTO): Promise<HydratedOrder>;
}
