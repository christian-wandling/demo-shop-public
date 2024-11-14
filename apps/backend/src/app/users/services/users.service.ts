import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { toUserDTO, UserDTO } from '../dtos/user-dto';
import { CreateUserDTO, fromDecodedToken } from '../dtos/create-user-dto';
import { DecodedToken } from '../../common/entities/decoded-token';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getFromToken(decodedToken: DecodedToken): Promise<UserDTO> {
    const user = await this.usersRepository.find(decodedToken.email);

    if (!user) {
      return this.createUser(fromDecodedToken(decodedToken));
    }

    return toUserDTO(user);
  }

  async createUser(dto: CreateUserDTO): Promise<UserDTO> {
    const user = await this.usersRepository.create(dto);

    if (!user) {
      throw new BadRequestException('Failed to create user');
    }

    return toUserDTO(user);
  }
}
