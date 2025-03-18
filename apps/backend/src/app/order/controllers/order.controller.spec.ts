import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from '../services/order.service';
import { OrderResponse } from '../dtos/order-response';
import { DecodeTokenPipe } from '../../common/pipes/decode-token-pipe';
import { RequestMethod } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { DecodedToken } from '../../common/models/decoded-token';

describe('OrdersController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  const mockOrderDto: OrderResponse = {
    id: 1,
    userId: 1,
    status: OrderStatus.Created,
    amount: 0,
    created: new Date(),
    items: [],
  };

  const mockDecodedToken: DecodedToken = {
    given_name: 'given_name',
    family_name: 'family_name',
    sub: 'sub',
    email: 'email@email.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            find: jest.fn().mockResolvedValue(mockOrderDto),
            findByUser: jest.fn().mockResolvedValue([mockOrderDto]),
            create: jest.fn().mockResolvedValue(mockOrderDto),
          },
        },
      ],
    })
      .overridePipe(DecodeTokenPipe)
      .useValue(jest.fn().mockReturnValue(mockDecodedToken))
      .compile();

    controller = module.get(OrderController);
    orderService = module.get(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('OrderController', () => {
    it('should have correct path', () => {
      const path = Reflect.getMetadata('path', OrderController);
      expect(path).toBe('orders');
    });

    it('should have correct version', () => {
      const version = Reflect.getMetadata('__version__', OrderController);
      expect(version).toBe('1');
    });

    it('should have the correct roles', () => {
      const roles = Reflect.getMetadata('roles', OrderController);
      expect(roles).toEqual({ roles: ['realm:buy_products'] });
    });
  });

  describe('getAllOrdersOfCurrentUser', () => {
    it('should return the order of current user', async () => {
      const result = await controller.getAllOrdersOfCurrentUser(mockDecodedToken);

      expect(result).toEqual([mockOrderDto]);
      expect(orderService.findByUser).toHaveBeenCalledWith(mockDecodedToken.sub);
      expect(orderService.findByUser).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', OrderController.prototype.getAllOrdersOfCurrentUser);
      expect(path).toEqual('/');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', OrderController.prototype.getAllOrdersOfCurrentUser);
      expect(method).toEqual(RequestMethod.GET);
    });
  });

  describe('getOrderById', () => {
    it('should return a order by id and keycloakId', async () => {
      const id = 1;

      const result = await controller.getOrderById(id, mockDecodedToken);

      expect(result).toEqual(mockOrderDto);
      expect(orderService.find).toHaveBeenCalledWith(Number(id), mockDecodedToken.sub);
      expect(orderService.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if order is not found', async () => {
      const id = 1;

      jest.spyOn(orderService, 'find').mockRejectedValueOnce(new Error('Order not found'));

      await expect(controller.getOrderById(id, mockDecodedToken)).rejects.toThrow('Order not found');
      expect(orderService.find).toHaveBeenCalledWith(Number(id), mockDecodedToken.sub);
      expect(orderService.find).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', OrderController.prototype.getOrderById);
      expect(path).toEqual(':id');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', OrderController.prototype.getOrderById);
      expect(method).toEqual(RequestMethod.GET);
    });
  });
});
