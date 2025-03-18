import { HydratedUser } from '../entities/hydrated-user';
import { UserIdentity } from '../dtos/user-identity';
import { UpdateUserPhoneRequest } from '../dtos/update-user-phone-request';
import { UpdateUserAddressRequest } from '../dtos/update-user-address-request';
import { Address } from '@prisma/client';

/**
 * Repository model for User entity operations.
 * Provides methods to interact with user data storage.
 */
export interface UserRepositoryModel {
  /**
   * Finds a user by their Keycloak ID.
   *
   * @param keycloakId - The unique Keycloak identifier for the user
   * @returns Promise resolving to the hydrated user with address information
   */
  findByKeycloakId(keycloakId: string): Promise<HydratedUser>;

  /**
   * Creates a new user in the system.
   *
   * @param dto - The user identity data transfer object containing user information
   * @returns Promise resolving to the newly created hydrated user
   */
  create(dto: UserIdentity): Promise<HydratedUser>;

  /**
   * Updates the address information for a given user.
   *
   * @param user - The hydrated user whose address will be updated
   * @param request - The request containing new address information
   * @returns Promise resolving to the updated address
   */
  updateAddress(user: HydratedUser, request: UpdateUserAddressRequest): Promise<Address>;

  /**
   * Updates the phone number for a given user.
   *
   * @param user - The hydrated user whose phone number will be updated
   * @param request - The request containing new phone information
   * @returns Promise resolving to the updated hydrated user
   */
  updatePhone(user: HydratedUser, request: UpdateUserPhoneRequest): Promise<HydratedUser>;
}
