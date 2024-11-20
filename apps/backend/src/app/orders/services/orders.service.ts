import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { OrderDTO, toOrderDto } from '../dtos/order-dto';
import { batchConvert } from '../../common/util/batch-convert';
import { ShoppingSessionDTO } from '../../shopping-sessions/dtos/shopping-session-dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async find(id: string, email: string): Promise<OrderDTO> {
    const order = await this.ordersRepository.find(id, email);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    return toOrderDto(order);
  }

  async findByUser(email: string): Promise<OrderDTO[]> {
    return batchConvert(await this.ordersRepository.findManyByUser(email), toOrderDto);
  }

  async createFromShoppingSession(shoppingSession: ShoppingSessionDTO): Promise<OrderDTO> {
    const order = await this.ordersRepository.createFromShoppingSession(shoppingSession);

    if (!order) {
      throw new BadRequestException('Failed to create order');
    }

    return toOrderDto(order);
  }
}
