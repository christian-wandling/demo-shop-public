import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { toUserResponse, UserResponse } from '../dtos/user-response';
import { fromDecodedToken, UserIdentity } from '../dtos/user-identity';
import { DecodedToken } from '../../common/entities/decoded-token';
import { MonitoringService } from '../../common/services/monitoring.service';

@Injectable()
export class UserService {
  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly usersRepository: UserRepository
  ) {}

  async getFromToken(decodedToken: DecodedToken): Promise<UserResponse> {
    const user = await this.usersRepository.find(decodedToken.email);

    if (!user) {
      return this.createUser(fromDecodedToken(decodedToken));
    }

    this.monitoringService.setUser({ id: user?.id });

    return toUserResponse(user);
  }

  async createUser(dto: UserIdentity): Promise<UserResponse> {
    const user = await this.usersRepository.create(dto);

    if (!user) {
      throw new BadRequestException('Failed to create user');
    }

    this.monitoringService.setUser({ id: user?.id });

    return toUserResponse(user);
  }
}
