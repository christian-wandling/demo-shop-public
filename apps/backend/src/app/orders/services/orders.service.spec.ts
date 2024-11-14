import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ShoppingSessionDTO } from '../../shopping-sessions/dtos/shopping-session-dto';
import { HydratedOrder } from '../entities/hydrated-order';
import { OrderDTO } from '../dtos/order-dto';
import { OrderStatus } from '@prisma/client';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: jest.Mocked<OrdersRepository>;

  const mockOrder: HydratedOrder = {
    id: 123,
    userId: 1,
    createdAt: new Date(),
    deleted: false,
    deletedAt: undefined,
    status: OrderStatus.CREATED,
    updatedAt: undefined,
    items: [],
  };

  const mockOrderDto: OrderDTO = {
    amount: 0,
    created: new Date(),
    status: OrderStatus.CREATED,
    userId: '1',
    id: '123',
    items: [],
  };

  const mockShoppingSession: ShoppingSessionDTO = {
    userId: '1',
    id: 'session123',
    items: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: {
            find: jest.fn(),
            findManyByUser: jest.fn(),
            createFromShoppingSession: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get(OrdersRepository);
  });

  describe('find', () => {
    it('should return an order when found', async () => {
      repository.find.mockResolvedValue(mockOrder);

      const result = await service.find('123', 'test@example.com');

      expect(result).toEqual(mockOrderDto);
      expect(repository.find).toHaveBeenCalledWith('123', 'test@example.com');
    });

    it('should throw the right exception when order is not found', async () => {
      repository.find.mockResolvedValue(null);

      await expect(service.find('123', 'test@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser', () => {
    it('should return array of orders for user', async () => {
      repository.findManyByUser.mockResolvedValue([mockOrder]);

      const result = await service.findByUser('test@example.com');

      expect(result).toEqual([mockOrderDto]);
      expect(repository.findManyByUser).toHaveBeenCalledWith('test@example.com');
    });

    it('should return empty array when no orders found', async () => {
      repository.findManyByUser.mockResolvedValue([]);

      const result = await service.findByUser('test@example.com');

      expect(result).toEqual([]);
    });
  });

  describe('createFromShoppingSession', () => {
    it('should create and return new order from shopping session', async () => {
      repository.createFromShoppingSession.mockResolvedValue(mockOrder);

      const result = await service.createFromShoppingSession(mockShoppingSession);

      expect(result).toEqual(mockOrderDto);
      expect(repository.createFromShoppingSession).toHaveBeenCalledWith(mockShoppingSession);
    });

    it('should throw the right exception when creation fails', async () => {
      repository.createFromShoppingSession.mockResolvedValue(null);

      await expect(service.createFromShoppingSession(mockShoppingSession)).rejects.toThrow(BadRequestException);
    });
  });
});
