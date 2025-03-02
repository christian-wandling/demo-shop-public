import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedUser } from '../entities/hydrated-user';
import { UserRepositoryModel } from '../models/user-repository.model';

import { UserIdentity } from '../dtos/user-identity';

@Injectable()
export class UserRepository implements UserRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  async find(email: string): Promise<HydratedUser> {
    return this.prisma.user.findUnique({
      where: {
        email,
        deleted: false,
      },
      include: {
        address: true,
      },
    });
  }

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
}
