import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';
import { OrderResponse } from './dtos/order-response';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { ForbiddenException, RequestMethod } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { ShoppingSessionService } from '../shopping-session/services/shopping-session.service';
import { ShoppingSessionResponse } from '../shopping-session/dtos/shopping-session-response';
import { DecodedToken } from '../common/entities/decoded-token';

describe('OrdersController', () => {
  let controller: OrderController;
  let ordersService: OrderService;
  let shoppingSessionsService: ShoppingSessionService;

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
        {
          provide: ShoppingSessionService,
          useValue: {
            findCurrentSessionForUser: jest.fn(),
          },
        },
      ],
    })
      .overridePipe(DecodeTokenPipe)
      .useValue(jest.fn().mockReturnValue(mockDecodedToken))
      .compile();

    controller = module.get(OrderController);
    ordersService = module.get(OrderService);
    shoppingSessionsService = module.get(ShoppingSessionService);
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

  describe('createOrder', () => {
    const mockShoppingSessionDto: ShoppingSessionResponse = {
      id: 123,
      userId: 1,
      items: [
        {
          id: 1,
          productId: 1,
          quantity: 2,
          productName: '',
          productThumbnail: '',
          unitPrice: 0,
          totalPrice: 0,
        },
      ],
    };

    it('should create an order from existing shopping session', async () => {
      jest.spyOn(shoppingSessionsService, 'findCurrentSessionForUser').mockResolvedValue(mockShoppingSessionDto);

      const result = await controller.createOrder(mockDecodedToken);

      expect(shoppingSessionsService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(ordersService.create).toHaveBeenCalledWith(mockShoppingSessionDto);
      expect(result).toEqual(mockOrderDto);
    });

    it('should throw the right exception when no shopping session exists', async () => {
      jest.spyOn(shoppingSessionsService, 'findCurrentSessionForUser').mockReturnValueOnce(null);

      await expect(controller.createOrder(mockDecodedToken)).rejects.toThrow(ForbiddenException);

      expect(shoppingSessionsService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(ordersService.create).not.toHaveBeenCalled();
    });

    it('should propagate errors from OrdersService', async () => {
      const error = new Error('Failed to create order');
      jest.spyOn(ordersService, 'create').mockRejectedValue(error);
      jest.spyOn(shoppingSessionsService, 'findCurrentSessionForUser').mockResolvedValue(mockShoppingSessionDto);

      await expect(controller.createOrder(mockDecodedToken)).rejects.toThrow(error);

      expect(shoppingSessionsService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(ordersService.create).toHaveBeenCalledWith(mockShoppingSessionDto);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', OrderController.prototype.createOrder);
      expect(path).toEqual('/');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', OrderController.prototype.createOrder);
      expect(method).toEqual(RequestMethod.POST);
    });
  });

  describe('getAllOrdersOfCurrentUser', () => {
    it('should return the order of current user', async () => {
      const result = await controller.getAllOrdersOfCurrentUser(mockDecodedToken);

      expect(result).toEqual([mockOrderDto]);
      expect(ordersService.findByUser).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(ordersService.findByUser).toHaveBeenCalledTimes(1);
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
    it('should return a order by id and email', async () => {
      const id = 1;

      const result = await controller.getOrderById(id, mockDecodedToken);

      expect(result).toEqual(mockOrderDto);
      expect(ordersService.find).toHaveBeenCalledWith(id, mockDecodedToken.email);
      expect(ordersService.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if order is not found', async () => {
      const id = 1;

      jest.spyOn(ordersService, 'find').mockRejectedValueOnce(new Error('Order not found'));

      await expect(controller.getOrderById(id, mockDecodedToken)).rejects.toThrow('Order not found');
      expect(ordersService.find).toHaveBeenCalledWith(id, mockDecodedToken.email);
      expect(ordersService.find).toHaveBeenCalledTimes(1);
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
