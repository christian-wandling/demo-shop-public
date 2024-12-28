import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedUser } from '../entities/hydrated-user';
import { UsersRepositoryModel } from '../models/users-repository.model';

import { CreateUserDTO } from '../dtos/create-user-dto';

@Injectable()
export class UsersRepository implements UsersRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  async find(email: string): Promise<HydratedUser> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        address: true,
      },
    });
  }

  async create(dto: CreateUserDTO): Promise<HydratedUser> {
    const { firstname, lastname, email, keycloakUserId } = dto;
    return this.prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        keycloakUserId,
      },
      include: {
        address: true,
      },
    });
  }
}
