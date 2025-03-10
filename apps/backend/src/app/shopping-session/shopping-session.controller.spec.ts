import { Test, TestingModule } from '@nestjs/testing';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { ShoppingSessionController } from './shopping-session.controller';
import { ShoppingSessionService } from './services/shopping-session.service';
import { ShoppingSessionResponse } from './dtos/shopping-session-response';
import { ForbiddenException, RequestMethod } from '@nestjs/common';
import { DecodedToken } from '../common/entities/decoded-token';
import { OrderResponse } from '../order/dtos/order-response';
import { OrderStatus } from '@prisma/client';

describe('ShoppingSessionsController', () => {
  let controller: ShoppingSessionController;
  let shoppingSessionService: ShoppingSessionService;

  const shoppingSessionResponse: ShoppingSessionResponse = {
    id: 1,
    userId: 1,
    items: [],
  };

  const mockDecodedToken: DecodedToken = {
    given_name: 'given_name',
    family_name: 'family_name',
    sub: 'sub',
    email: 'email@email.com',
  };

  const mockOrderDto: OrderResponse = {
    id: 1,
    userId: 1,
    status: OrderStatus.Created,
    amount: 0,
    created: new Date(),
    items: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingSessionController],
      providers: [
        {
          provide: ShoppingSessionService,
          useValue: {
            create: jest.fn().mockResolvedValue(shoppingSessionResponse),
            findCurrentSessionForUser: jest.fn().mockResolvedValue(shoppingSessionResponse),
            remove: jest.fn().mockResolvedValue(undefined),
            checkout: jest.fn().mockResolvedValue(mockOrderDto),
          },
        },
      ],
    })
      .overridePipe(DecodeTokenPipe)
      .useValue(jest.fn().mockReturnValue(mockDecodedToken))
      .compile();

    controller = module.get(ShoppingSessionController);
    shoppingSessionService = module.get(ShoppingSessionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ShoppingSessionController', () => {
    it('should have correct path', () => {
      const path = Reflect.getMetadata('path', ShoppingSessionController);
      expect(path).toBe('shopping-sessions');
    });

    it('should have correct version', () => {
      const version = Reflect.getMetadata('__version__', ShoppingSessionController);
      expect(version).toBe('1');
    });

    it('should have the correct roles', () => {
      const roles = Reflect.getMetadata('roles', ShoppingSessionController);
      expect(roles).toEqual({ roles: ['realm:buy_products'] });
    });
  });

  describe('createShoppingSession', () => {
    it('should create a shopping session by email', async () => {
      const result = await controller.createShoppingSession(mockDecodedToken);

      expect(result).toEqual(shoppingSessionResponse);
      expect(shoppingSessionService.create).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(shoppingSessionService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if shopping session could not be created', async () => {
      jest.spyOn(shoppingSessionService, 'create').mockRejectedValueOnce(new Error('ShoppingSession not found'));

      await expect(controller.createShoppingSession(mockDecodedToken)).rejects.toThrow('ShoppingSession not found');
      expect(shoppingSessionService.create).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(shoppingSessionService.create).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', ShoppingSessionController.prototype.createShoppingSession);
      expect(path).toEqual('/');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', ShoppingSessionController.prototype.createShoppingSession);
      expect(method).toEqual(RequestMethod.POST);
    });
  });

  describe('getCurrentShoppingSession', () => {
    it('should return a shopping session by email', async () => {
      const result = await controller.getShoppingSessionOfCurrentUser(mockDecodedToken);

      expect(result).toEqual(shoppingSessionResponse);
      expect(shoppingSessionService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(shoppingSessionService.findCurrentSessionForUser).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if shopping session is not found', async () => {
      jest
        .spyOn(shoppingSessionService, 'findCurrentSessionForUser')
        .mockRejectedValueOnce(new Error('ShoppingSession not found'));

      await expect(controller.getShoppingSessionOfCurrentUser(mockDecodedToken)).rejects.toThrow(
        'ShoppingSession not found'
      );
      expect(shoppingSessionService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(shoppingSessionService.findCurrentSessionForUser).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', ShoppingSessionController.prototype.getShoppingSessionOfCurrentUser);
      expect(path).toEqual('current');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', ShoppingSessionController.prototype.getShoppingSessionOfCurrentUser);
      expect(method).toEqual(RequestMethod.GET);
    });
  });

  describe('checkout', () => {
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

    it('should checkout an existing shopping session and return an order', async () => {
      const result = await controller.checkout(mockDecodedToken);
      expect(shoppingSessionService.checkout).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(result).toEqual(mockOrderDto);
    });

    it('should propagate errors from ShoppingSessionService', async () => {
      const error = new Error('Failed to create order');
      jest.spyOn(shoppingSessionService, 'checkout').mockRejectedValue(error);

      await expect(controller.checkout(mockDecodedToken)).rejects.toThrow(error);
      expect(shoppingSessionService.checkout).toHaveBeenCalledWith(mockDecodedToken.email);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', ShoppingSessionController.prototype.checkout);
      expect(path).toEqual('checkout');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', ShoppingSessionController.prototype.checkout);
      expect(method).toEqual(RequestMethod.POST);
    });
  });
});
