import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { ShoppingSession } from '@prisma/client';

/**
 * Repository model interface for managing shopping sessions.
 * Defines operations for finding, creating and removing shopping sessions.
 */
export interface ShoppingSessionRepositoryModel {
  /**
   * Finds a shopping session associated with the specified email.
   * Returns a fully hydrated shopping session including cart items with associated products and images.
   *
   * @param email - The email address identifying the user's shopping session
   * @returns Promise resolving to the hydrated shopping session
   */
  find(email: string): Promise<HydratedShoppingSession>;

  /**
   * Creates a new shopping session for the specified email.
   *
   * @param email - The email address to associate with the new shopping session
   * @returns Promise resolving to the newly created hydrated shopping session
   */
  create(email: string): Promise<HydratedShoppingSession>;

  /**
   * Removes a shopping session with the specified ID and email.
   *
   * @param id - The ID of the shopping session to remove
   * @param email - The email associated with the shopping session for verification
   * @returns Promise resolving to the removed shopping session
   */
  remove(id: number, email: string): Promise<ShoppingSession>;
}
