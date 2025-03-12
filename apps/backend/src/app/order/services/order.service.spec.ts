import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { HydratedOrder } from '../entities/hydrated-order';
import { OrderResponse } from '../dtos/order-response';
import { OrderStatus } from '@prisma/client';
import { CreateOrderDto } from '../dtos/create-order-dto';

describe('OrdersService', () => {
  let service: OrderService;
  let repository: jest.Mocked<OrderRepository>;

  const date = new Date();

  const mockOrder: HydratedOrder = {
    id: 123,
    user_id: 1,
    created_at: date,
    deleted: false,
    deleted_at: undefined,
    status: OrderStatus.Created,
    updated_at: undefined,
    order_items: [],
  };

  const mockOrderDto: OrderResponse = {
    amount: 0,
    created: date,
    status: OrderStatus.Created,
    userId: 1,
    id: 123,
    items: [],
  };

  const mockCreateOrderDto: CreateOrderDto = {
    userId: 1,
    shoppingSessionId: 123,
    items: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            find: jest.fn(),
            findManyByUser: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get(OrderRepository);
  });

  describe('find', () => {
    it('should return an order when found', async () => {
      repository.find.mockResolvedValue(mockOrder);

      const result = await service.find(123, 'test@example.com');

      expect(result).toEqual(mockOrderDto);
      expect(repository.find).toHaveBeenCalledWith(123, 'test@example.com');
    });

    it('should throw the right exception when order is not found', async () => {
      repository.find.mockResolvedValue(null);

      await expect(service.find(123, 'test@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser', () => {
    it('should return array of orders for user', async () => {
      repository.findManyByUser.mockResolvedValue([mockOrder]);

      const result = await service.findByUser('test@example.com');

      expect(result).toEqual({ items: [mockOrderDto] });
      expect(repository.findManyByUser).toHaveBeenCalledWith('test@example.com');
    });

    it('should return empty when no orders found', async () => {
      repository.findManyByUser.mockResolvedValue([]);

      const result = await service.findByUser('test@example.com');

      expect(result).toEqual({ items: [] });
    });
  });
});
