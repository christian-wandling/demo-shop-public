import { HydratedProduct } from '../entities/hydrated-product';

export interface ProductsRepositoryModel {
  all(): Promise<HydratedProduct[]>;
  find(id: number): Promise<HydratedProduct>;
}
