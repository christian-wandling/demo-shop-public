import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ShoppingSessionResponse, toShoppingSessionResponse } from '../dtos/shopping-session-response';
import { ShoppingSessionRepository } from './shopping-session.repository';
import { OrderResponse, toOrderResponse } from '../../order/dtos/order-response';
import { CreateOrderDto } from '../../order/dtos/create-order-dto';

/**
 * Service responsible for managing shopping sessions for users.
 * Handles creation, checkout, retrieval, and deletion of shopping sessions.
 */
@Injectable()
export class ShoppingSessionService {
  constructor(private readonly shoppingSessionsRepository: ShoppingSessionRepository) {}

  /**
   * Creates a new shopping session for a user.
   * @param email The email or keycloak ID of the user
   * @returns Promise containing the created shopping session data
   * @throws BadRequestException if the session creation fails
   */
  async create(email: string): Promise<ShoppingSessionResponse> {
    const session = await this.shoppingSessionsRepository.create(email);

    if (!session) {
      throw new BadRequestException('Failed to create shopping session');
    }

    return toShoppingSessionResponse(session);
  }

  /**
   * Processes checkout for the user's current shopping session.
   * Converts the shopping session into an order.
   * @param keycloakId The ID of the user in Keycloak
   * @returns Promise containing the created order data
   * @throws ForbiddenException if no active shopping session is found
   * @throws BadRequestException if order creation fails
   */
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
      throw new BadRequestException('Order could not be created');
    }

    return toOrderResponse(order);
  }

  /**
   * Finds or creates a shopping session for the specified user.
   * @param keycloakId The ID of the user in Keycloak
   * @returns Promise containing the user's current shopping session
   */
  async findCurrentSessionForUser(keycloakId: string): Promise<ShoppingSessionResponse> {
    const shoppingSession = await this.shoppingSessionsRepository.find(keycloakId);

    if (!shoppingSession) {
      return this.create(keycloakId);
    }

    return toShoppingSessionResponse(shoppingSession);
  }

  /**
   * Removes a shopping session with the given ID if it belongs to the specified user.
   * @param id The ID of the shopping session to remove
   * @param keycloakId The ID of the user in Keycloak
   * @throws NotFoundException if the shopping session is not found
   */
  async remove(id: number, keycloakId: string): Promise<void> {
    const shoppingSession = await this.shoppingSessionsRepository.remove(id, keycloakId);

    if (!shoppingSession) {
      throw new NotFoundException(`Shopping session not found`);
    }
  }
}
