import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedUser } from '../entities/hydrated-user';
import { UsersRepositoryModel } from '../models/users-repository.model';

@Injectable()
export class UsersRepository implements UsersRepositoryModel {
  constructor(private prisma: PrismaService) {}

  async find(email: string): Promise<HydratedUser> {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
      include: {
        address: true,
      },
    });
  }
}
