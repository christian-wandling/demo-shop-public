import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ShoppingSessionResponse, toShoppingSessionResponse } from '../dtos/shopping-session-response';
import { ShoppingSessionRepository } from './shopping-session.repository';
import { OrderResponse, toOrderResponse } from '../../order/dtos/order-response';
import { CreateOrderDto } from '../../order/dtos/create-order-dto';

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

  async checkout(keycloakId: string): Promise<OrderResponse> {
    const shoppingSession = await this.findCurrentSessionForUser(keycloakId);

    if (!shoppingSession) {
      throw new ForbiddenException('No active shopping session found. Please login to start a new shopping session.');
    }

    const createOrder: CreateOrderDto = {
      shoppingSessionId: shoppingSession.id,
      userId: shoppingSession.userId,
      items: shoppingSession.items.map(item => ({
        product_id: item.productId,
        product_name: item.productName,
        product_thumbnail: item.productThumbnail,
        quantity: item.quantity,
        price: item.unitPrice,
      })),
    };

    const order = await this.shoppingSessionsRepository.checkout(createOrder);

    if (!order) {
      throw new Error('Order could not be created');
    }

    return toOrderResponse(order);
  }

  async findCurrentSessionForUser(keycloakId: string): Promise<ShoppingSessionResponse> {
    const shoppingSession = await this.shoppingSessionsRepository.find(keycloakId);

    if (!shoppingSession) {
      return this.create(keycloakId);
    }

    return toShoppingSessionResponse(shoppingSession);
  }

  async remove(id: number, keycloakId: string): Promise<void> {
    const shoppingSession = await this.shoppingSessionsRepository.remove(id, keycloakId);

    if (!shoppingSession) {
      throw new NotFoundException(`Shopping session not found`);
    }
  }
}
