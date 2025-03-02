import { HydratedProduct } from '../entities/hydrated-product';

export interface ProductRepositoryModel {
  all(): Promise<HydratedProduct[]>;
  find(id: number): Promise<HydratedProduct>;
}
