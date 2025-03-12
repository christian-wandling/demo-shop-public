import { HydratedOrder } from '../entities/hydrated-order';

export interface OrderRepositoryModel {
  find(id: number, email: string): Promise<HydratedOrder>;

  findManyByUser(email: string): Promise<HydratedOrder[]>;
}
