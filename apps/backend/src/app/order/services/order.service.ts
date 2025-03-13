import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderResponse, toOrderResponse } from '../dtos/order-response';
import { batchConvert } from '../../common/util/batch-convert';
import { OrderListResponse } from '../dtos/order-list-response';

@Injectable()
export class OrderService {
  constructor(private readonly ordersRepository: OrderRepository) {}

  async find(id: number, keycloakId: string): Promise<OrderResponse> {
    const order = await this.ordersRepository.find(id, keycloakId);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    return toOrderResponse(order);
  }

  async findByUser(keycloakId: string): Promise<OrderListResponse> {
    return {
      items: batchConvert(await this.ordersRepository.findManyByUser(keycloakId), toOrderResponse),
    };
  }
}
