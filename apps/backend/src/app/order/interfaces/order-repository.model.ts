import { HydratedOrder } from '../entities/hydrated-order';

/**
 * Repository interface for Order operations.
 *
 * Provides methods to retrieve order data from the underlying data store.
 */
export interface OrderRepositoryModel {
  /**
   * Retrieves a specific order by its ID and user email.
   *
   * @param id - The unique identifier of the order to find
   * @param email - The email address of the user who owns the order
   * @returns A promise that resolves to a hydrated order with its order items included
   */
  find(id: number, email: string): Promise<HydratedOrder>;

  /**
   * Retrieves all orders associated with a specific user.
   *
   * @param email - The email address of the user whose orders to retrieve
   * @returns A promise that resolves to an array of hydrated orders with their order items included
   */
  findManyByUser(email: string): Promise<HydratedOrder[]>;
}
