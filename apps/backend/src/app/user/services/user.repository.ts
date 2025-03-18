import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedUser } from '../entities/hydrated-user';
import { UserRepositoryModel } from '../interfaces/user-repository.model';

import { UserIdentity } from '../dtos/user-identity';
import { Address } from '@prisma/client';
import { UpdateUserAddressRequest } from '../dtos/update-user-address-request';
import { UpdateUserPhoneRequest } from '../dtos/update-user-phone-request';

/**
 * Repository implementation for user data operations.
 * Provides concrete implementations of the UserRepositoryModel interface
 * using Prisma ORM to interact with the database.
 */
@Injectable()
export class UserRepository implements UserRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves a user by their Keycloak ID.
   * Only returns non-deleted users.
   *
   * @param keycloakId - The unique Keycloak identifier for the user
   * @returns Promise resolving to the hydrated user with address information
   */
  async findByKeycloakId(keycloakId: string): Promise<HydratedUser> {
    return this.prisma.user.findUnique({
      where: {
        keycloak_user_id: keycloakId,
        deleted: false,
      },
      include: {
        address: true,
      },
    });
  }

  /**
   * Creates a new user in the database.
   *
   * @param dto - The user identity data transfer object containing user information
   * @returns Promise resolving to the newly created hydrated user
   */
  async create(dto: UserIdentity): Promise<HydratedUser> {
    const { firstname, lastname, email, keycloakUserId } = dto;
    return this.prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        keycloak_user_id: keycloakUserId,
      },
      include: {
        address: true,
      },
    });
  }

  /**
   * Updates or creates an address for a given user.
   * Uses Prisma's upsert operation to either create a new address
   * or update an existing one.
   *
   * @param user - The hydrated user whose address will be updated
   * @param request - The request containing new address information
   * @returns Promise resolving to the updated address
   */
  async updateAddress(user: HydratedUser, request: UpdateUserAddressRequest): Promise<Address> {
    const result = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        address: {
          upsert: {
            create: request,
            update: request,
          },
        },
      },
      include: {
        address: true,
      },
    });

    return result.address;
  }

  /**
   * Updates the phone number for a given user.
   *
   * @param user - The hydrated user whose phone number will be updated
   * @param request - The request containing new phone information
   * @returns Promise resolving to the updated hydrated user
   */
  async updatePhone(user: HydratedUser, request: UpdateUserPhoneRequest): Promise<HydratedUser> {
    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        phone: request.phone,
      },
      include: {
        address: true,
      },
    });
  }
}
