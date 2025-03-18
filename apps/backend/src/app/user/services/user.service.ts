import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { toUserResponse, UserResponse } from '../dtos/user-response';
import { fromDecodedToken, UserIdentity } from '../dtos/user-identity';
import { DecodedToken } from '../../common/models/decoded-token';
import { MonitoringService } from '../../common/services/monitoring.service';
import { UpdateUserAddressRequest } from '@demo-shop/api';
import { AddressResponse, toAddressResponse } from '../dtos/address-response';
import { UpdateUserPhoneRequest } from '../dtos/update-user-phone-request';
import { UserRepository } from './user.repository';

/**
 * Service responsible for user-related operations.
 * Handles user resolution, creation, and updates by interfacing with the repository.
 */
@Injectable()
export class UserService {
  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly usersRepository: UserRepository
  ) {}

  /**
   * Creates a new user with the provided identity information.
   * Sets the user in the monitoring service for tracking.
   *
   * @param identity - The user identity information
   * @returns Promise resolving to the user response object
   * @throws BadRequestException if user creation fails
   */
  async resolveCurrentUser(decodedToken: DecodedToken): Promise<UserResponse> {
    const user = await this.usersRepository.findByKeycloakId(decodedToken.sub);
    if (!user) {
      return this.createUser(fromDecodedToken(decodedToken));
    }

    this.monitoringService.setUser({ id: user?.id });

    return toUserResponse(user);
  }

  /**
   * Creates a new user with the provided identity information.
   * Sets the user in the monitoring service for tracking.
   *
   * @param identity - The user identity information
   * @returns Promise resolving to the user response object
   * @throws BadRequestException if user creation fails
   */
  async createUser(identity: UserIdentity): Promise<UserResponse> {
    const user = await this.usersRepository.create(identity);
    if (!user) {
      throw new BadRequestException('Failed to create user');
    }

    this.monitoringService.setUser({ id: user?.id });

    return toUserResponse(user);
  }

  /**
   * Updates the address for the current user.
   *
   * @param decodedToken - The decoded JWT token to identify the current user
   * @param request - The request containing new address information
   * @returns Promise resolving to the address response object
   * @throws NotFoundException if the user is not found
   * @throws InternalServerErrorException if address update fails
   */
  async updateCurrentUserAddress(
    decodedToken: DecodedToken,
    request: UpdateUserAddressRequest
  ): Promise<AddressResponse> {
    const user = await this.usersRepository.findByKeycloakId(decodedToken.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = await this.usersRepository.updateAddress(user, request);
    if (!result) {
      throw new InternalServerErrorException('Error updating user address');
    }

    return toAddressResponse(result);
  }

  /**
   * Updates the phone number for the current user.
   *
   * @param decodedToken - The decoded JWT token to identify the current user
   * @param request - The request containing the new phone number
   * @returns Promise resolving to the updated user response object
   * @throws NotFoundException if the user is not found
   * @throws InternalServerErrorException if phone update fails
   */
  async updateCurrentUserPhone(decodedToken: DecodedToken, request: UpdateUserPhoneRequest): Promise<UserResponse> {
    const user = await this.usersRepository.findByKeycloakId(decodedToken.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = await this.usersRepository.updatePhone(user, request);
    if (!result) {
      throw new InternalServerErrorException('Error updating user phone');
    }

    return toUserResponse(result);
  }
}
