import { HydratedOrder } from '../entities/hydrated-order';
import { CreateOrderDto } from '../dtos/create-order-dto';

export interface OrderRepositoryModel {
  find(id: number, email: string): Promise<HydratedOrder>;

  findManyByUser(email: string): Promise<HydratedOrder[]>;

  create(dto: CreateOrderDto): Promise<HydratedOrder>;
}
