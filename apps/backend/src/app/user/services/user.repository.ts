import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedUser } from '../entities/hydrated-user';
import { UserRepositoryModel } from '../models/user-repository.model';

import { UserIdentity } from '../dtos/user-identity';
import { Address } from '@prisma/client';
import { UpdateUserAddressRequest } from '../dtos/update-user-address-request';
import { UpdateUserPhoneRequest } from '../dtos/update-user-phone-request';

@Injectable()
export class UserRepository implements UserRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

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
