import { Test, TestingModule } from '@nestjs/testing';
import { DecodeTokenPipe } from '../../common/pipes/decode-token-pipe';
import { ShoppingSessionController } from './shopping-session.controller';
import { ShoppingSessionService } from '../services/shopping-session.service';
import { ShoppingSessionResponse } from '../dtos/shopping-session-response';
import { ForbiddenException, RequestMethod } from '@nestjs/common';
import { DecodedToken } from '../../common/models/decoded-token';
import { OrderResponse } from '../../order/dtos/order-response';
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

  describe('resolveShoppingSessionOfCurrentUser', () => {
    it('should return a shopping session by email', async () => {
      const result = await controller.resolveShoppingSessionOfCurrentUser(mockDecodedToken);

      expect(result).toEqual(shoppingSessionResponse);
      expect(shoppingSessionService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.sub);
      expect(shoppingSessionService.findCurrentSessionForUser).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if shopping session is not found', async () => {
      jest
        .spyOn(shoppingSessionService, 'findCurrentSessionForUser')
        .mockRejectedValueOnce(new Error('ShoppingSession not found'));

      await expect(controller.resolveShoppingSessionOfCurrentUser(mockDecodedToken)).rejects.toThrow(
        'ShoppingSession not found'
      );
      expect(shoppingSessionService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.sub);
      expect(shoppingSessionService.findCurrentSessionForUser).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', ShoppingSessionController.prototype.resolveShoppingSessionOfCurrentUser);
      expect(path).toEqual('current');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata(
        'method',
        ShoppingSessionController.prototype.resolveShoppingSessionOfCurrentUser
      );
      expect(method).toEqual(RequestMethod.POST);
    });
  });

  describe('checkout', () => {
    it('should checkout an existing shopping session and return an order', async () => {
      const result = await controller.checkout(mockDecodedToken);
      expect(shoppingSessionService.checkout).toHaveBeenCalledWith(mockDecodedToken.sub);
      expect(result).toEqual(mockOrderDto);
    });

    it('should propagate errors from ShoppingSessionService', async () => {
      const error = new Error('Failed to create order');
      jest.spyOn(shoppingSessionService, 'checkout').mockRejectedValue(error);

      await expect(controller.checkout(mockDecodedToken)).rejects.toThrow(error);
      expect(shoppingSessionService.checkout).toHaveBeenCalledWith(mockDecodedToken.sub);
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
