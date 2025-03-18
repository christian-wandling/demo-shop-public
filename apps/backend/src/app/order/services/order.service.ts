import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderResponse, toOrderResponse } from '../dtos/order-response';
import { batchConvert } from '../../common/util/batch-convert';
import { OrderListResponse } from '../dtos/order-list-response';

/**
 * Service responsible for handling order-related business logic.
 *
 * This service acts as an intermediary between controllers and the repository layer,
 * providing order operations and transforming data models to response DTOs.
 */
@Injectable()
export class OrderService {
  constructor(private readonly ordersRepository: OrderRepository) {}

  /**
   * Finds a specific order by ID and user Keycloak ID and transforms it to a response DTO.
   *
   * @param id - The unique identifier of the order to find
   * @param keycloakId - The Keycloak ID of the user who owns the order
   * @returns A promise that resolves to an OrderResponse DTO
   * @throws NotFoundException if the order doesn't exist
   */
  async find(id: number, keycloakId: string): Promise<OrderResponse> {
    const order = await this.ordersRepository.find(id, keycloakId);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    return toOrderResponse(order);
  }

  /**
   * Retrieves all orders for a specific user and transforms them to a response DTO.
   *
   * @param keycloakId - The Keycloak ID of the user whose orders to retrieve
   * @returns A promise that resolves to an OrderListResponse containing transformed order items
   */
  async findByUser(keycloakId: string): Promise<OrderListResponse> {
    return {
      items: batchConvert(await this.ordersRepository.findManyByUser(keycloakId), toOrderResponse),
    };
  }
}
