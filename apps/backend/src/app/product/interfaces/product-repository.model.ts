import { HydratedProduct } from '../entities/hydrated-product';

/**
 * Interface defining the contract for product repository implementations
 * Provides methods to retrieve product data from a data source
 */
export interface ProductRepositoryModel {
  /**
   * Retrieves all available products
   * @returns A promise that resolves to an array of hydrated product objects
   */
  all(): Promise<HydratedProduct[]>;

  /**
   * Finds a specific product by its unique identifier
   * @param id The numeric identifier of the product to find
   * @returns A promise that resolves to the hydrated product if found
   * @throws May throw an error if the product with the given ID doesn't exist
   */
  find(id: number): Promise<HydratedProduct>;
}
