import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { toUserResponse, UserResponse } from '../dtos/user-response';
import { fromDecodedToken, UserIdentity } from '../dtos/user-identity';
import { DecodedToken } from '../../common/models/decoded-token';
import { MonitoringService } from '../../common/services/monitoring.service';
import { UpdateUserAddressRequest } from '@demo-shop/api';
import { AddressResponse, toAddressResponse } from '../dtos/address-response';
import { UpdateUserPhoneRequest } from '../dtos/update-user-phone-request';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly usersRepository: UserRepository
  ) {}

  async resolveCurrentUser(decodedToken: DecodedToken): Promise<UserResponse> {
    const user = await this.usersRepository.findByKeycloakId(decodedToken.sub);
    if (!user) {
      return this.createUser(fromDecodedToken(decodedToken));
    }

    this.monitoringService.setUser({ id: user?.id });

    return toUserResponse(user);
  }

  async createUser(identity: UserIdentity): Promise<UserResponse> {
    const user = await this.usersRepository.create(identity);
    if (!user) {
      throw new BadRequestException('Failed to create user');
    }

    this.monitoringService.setUser({ id: user?.id });

    return toUserResponse(user);
  }

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
