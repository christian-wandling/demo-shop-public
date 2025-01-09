import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './services/orders.service';
import { OrderDTO } from './dtos/order-dto';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { ForbiddenException, RequestMethod } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { ShoppingSessionsService } from '../shopping-sessions/services/shopping-sessions.service';
import { ShoppingSessionDTO } from '../shopping-sessions/dtos/shopping-session-dto';
import { DecodedToken } from '../common/entities/decoded-token';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: OrdersService;
  let shoppingSessionsService: ShoppingSessionsService;

  const mockOrderDto: OrderDTO = {
    id: 1,
    userId: 1,
    status: OrderStatus.CREATED,
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
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            find: jest.fn().mockResolvedValue(mockOrderDto),
            findByUser: jest.fn().mockResolvedValue([mockOrderDto]),
            create: jest.fn().mockResolvedValue(mockOrderDto),
          },
        },
        {
          provide: ShoppingSessionsService,
          useValue: {
            findCurrentSessionForUser: jest.fn(),
          },
        },
      ],
    })
      .overridePipe(DecodeTokenPipe)
      .useValue(jest.fn().mockReturnValue(mockDecodedToken))
      .compile();

    controller = module.get(OrdersController);
    ordersService = module.get(OrdersService);
    shoppingSessionsService = module.get(ShoppingSessionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('OrderController', () => {
    it('should have correct path', () => {
      const path = Reflect.getMetadata('path', OrdersController);
      expect(path).toBe('orders');
    });

    it('should have correct version', () => {
      const version = Reflect.getMetadata('__version__', OrdersController);
      expect(version).toBe('1');
    });

    it('should have the correct roles', () => {
      const roles = Reflect.getMetadata('roles', OrdersController);
      expect(roles).toEqual({ roles: ['realm:buy_products'] });
    });
  });

  describe('createOrder', () => {
    const mockShoppingSessionDto: ShoppingSessionDTO = {
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
      const path = Reflect.getMetadata('path', OrdersController.prototype.createOrder);
      expect(path).toEqual('/');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', OrdersController.prototype.createOrder);
      expect(method).toEqual(RequestMethod.POST);
    });
  });

  describe('getOrdersOfCurrentUser', () => {
    it('should return the order of current user', async () => {
      const result = await controller.getOrdersOfCurrentUser(mockDecodedToken);

      expect(result).toEqual([mockOrderDto]);
      expect(ordersService.findByUser).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(ordersService.findByUser).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', OrdersController.prototype.getOrdersOfCurrentUser);
      expect(path).toEqual('/');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', OrdersController.prototype.getOrdersOfCurrentUser);
      expect(method).toEqual(RequestMethod.GET);
    });
  });

  describe('getOrder', () => {
    it('should return a order by id and email', async () => {
      const id = 1;

      const result = await controller.getOrder(id, mockDecodedToken);

      expect(result).toEqual(mockOrderDto);
      expect(ordersService.find).toHaveBeenCalledWith(id, mockDecodedToken.email);
      expect(ordersService.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if order is not found', async () => {
      const id = 1;

      jest.spyOn(ordersService, 'find').mockRejectedValueOnce(new Error('Order not found'));

      await expect(controller.getOrder(id, mockDecodedToken)).rejects.toThrow('Order not found');
      expect(ordersService.find).toHaveBeenCalledWith(id, mockDecodedToken.email);
      expect(ordersService.find).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', OrdersController.prototype.getOrder);
      expect(path).toEqual(':id');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', OrdersController.prototype.getOrder);
      expect(method).toEqual(RequestMethod.GET);
    });
  });
});
