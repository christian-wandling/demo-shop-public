import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ShoppingSessionResponse, toShoppingSessionResponse } from '../dtos/shopping-session-response';
import { ShoppingSessionRepository } from './shopping-session.repository';

@Injectable()
export class ShoppingSessionService {
  constructor(private readonly shoppingSessionsRepository: ShoppingSessionRepository) {}

  async create(email: string): Promise<ShoppingSessionResponse> {
    const session = await this.shoppingSessionsRepository.create(email);

    if (!session) {
      throw new BadRequestException('Failed to create shopping session');
    }

    return toShoppingSessionResponse(session);
  }

  async findCurrentSessionForUser(email: string): Promise<ShoppingSessionResponse> {
    const shoppingSession = await this.shoppingSessionsRepository.find(email);

    if (!shoppingSession) {
      return this.create(email);
    }

    return toShoppingSessionResponse(shoppingSession);
  }

  async remove(id: number, email: string): Promise<void> {
    const shoppingSession = await this.shoppingSessionsRepository.remove(id, email);

    if (!shoppingSession) {
      throw new NotFoundException(`Shopping session not found`);
    }
  }
}
