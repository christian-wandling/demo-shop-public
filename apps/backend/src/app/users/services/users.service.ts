import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { toUserDTO, UserDTO } from '../dtos/user-dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string): Promise<UserDTO> {
    const user = await this.usersRepository.find(email);

    if (!user) {
      throw new NotFoundException();
    }

    return toUserDTO(user);
  }
}
