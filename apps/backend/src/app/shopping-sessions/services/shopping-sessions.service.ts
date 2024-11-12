import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ShoppingSessionDTO, toShoppingSessionDTO } from '../dtos/shopping-session-dto';
import { ShoppingSessionsRepository } from './shopping-sessions.repository';

@Injectable()
export class ShoppingSessionsService {
  constructor(private readonly shoppingSessionsRepository: ShoppingSessionsRepository) {}

  async create(email: string): Promise<ShoppingSessionDTO> {
    const session = await this.shoppingSessionsRepository.create(email);

    if (!session) {
      throw new InternalServerErrorException();
    }

    return toShoppingSessionDTO(session);
  }

  async findCurrentSessionForUser(email: string): Promise<ShoppingSessionDTO> {
    const shoppingSession = await this.shoppingSessionsRepository.find(email);

    if (!shoppingSession) {
      return this.create(email);
    }

    return toShoppingSessionDTO(shoppingSession);
  }

  async remove(id: string, email: string): Promise<void> {
    const shoppingSession = await this.shoppingSessionsRepository.remove(id, email);

    if (!shoppingSession) {
      throw new InternalServerErrorException();
    }
  }
}