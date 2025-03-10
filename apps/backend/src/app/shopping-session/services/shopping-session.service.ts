import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ShoppingSessionResponse, toShoppingSessionResponse } from '../dtos/shopping-session-response';
import { ShoppingSessionRepository } from './shopping-session.repository';
import { OrderResponse } from '../../order/dtos/order-response';
import { OrderService } from '../../order/services/order.service';

@Injectable()
export class ShoppingSessionService {
  constructor(
    private readonly orderService: OrderService,
    private readonly shoppingSessionsRepository: ShoppingSessionRepository
  ) {}

  async create(email: string): Promise<ShoppingSessionResponse> {
    const session = await this.shoppingSessionsRepository.create(email);

    if (!session) {
      throw new BadRequestException('Failed to create shopping session');
    }

    return toShoppingSessionResponse(session);
  }

  async checkout(email: string): Promise<OrderResponse> {
    const shoppingSession = await this.findCurrentSessionForUser(email);

    if (!shoppingSession) {
      throw new ForbiddenException('No active shopping session found. Please login to start a new shopping session.');
    }

    return this.orderService.create(shoppingSession);
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
