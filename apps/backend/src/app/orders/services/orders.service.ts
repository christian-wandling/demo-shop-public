import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { OrderDTO, toOrderDto } from '../dtos/order-dto';
import { batchConvert } from '../../common/util/batch-convert';
import { toCreateOrderDto } from '../dtos/create-order-dto';
import { ShoppingSessionDTO } from '../../shopping-sessions/dtos/shopping-session-dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async find(id: number, email: string): Promise<OrderDTO> {
    const order = await this.ordersRepository.find(id, email);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    return toOrderDto(order);
  }

  async findByUser(email: string): Promise<OrderDTO[]> {
    return batchConvert(await this.ordersRepository.findManyByUser(email), toOrderDto);
  }

  async create(shoppingSessionDto: ShoppingSessionDTO): Promise<OrderDTO> {
    const createOrderDto = toCreateOrderDto(shoppingSessionDto);

    const order = await this.ordersRepository.create(createOrderDto);

    if (!order) {
      throw new BadRequestException('Failed to create order');
    }

    return toOrderDto(order);
  }
}
