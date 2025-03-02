import { Test, TestingModule } from '@nestjs/testing';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { ShoppingSessionController } from './shopping-session.controller';
import { ShoppingSessionService } from './services/shopping-session.service';
import { ShoppingSessionResponse } from './dtos/shopping-session-response';
import { RequestMethod } from '@nestjs/common';
import { DecodedToken } from '../common/entities/decoded-token';

describe('ShoppingSessionsController', () => {
  let controller: ShoppingSessionController;
  let shoppingSessionsService: ShoppingSessionService;

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
          },
        },
      ],
    })
      .overridePipe(DecodeTokenPipe)
      .useValue(jest.fn().mockReturnValue(mockDecodedToken))
      .compile();

    controller = module.get(ShoppingSessionController);
    shoppingSessionsService = module.get(ShoppingSessionService);
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
      const email = 'test@example.com';

      const result = await controller.createShoppingSession(mockDecodedToken);

      expect(result).toEqual(shoppingSessionResponse);
      expect(shoppingSessionsService.create).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(shoppingSessionsService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if shopping session could not be created', async () => {
      jest.spyOn(shoppingSessionsService, 'create').mockRejectedValueOnce(new Error('ShoppingSession not found'));

      await expect(controller.createShoppingSession(mockDecodedToken)).rejects.toThrow('ShoppingSession not found');
      expect(shoppingSessionsService.create).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(shoppingSessionsService.create).toHaveBeenCalledTimes(1);
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
      expect(shoppingSessionsService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(shoppingSessionsService.findCurrentSessionForUser).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if shopping session is not found', async () => {
      jest
        .spyOn(shoppingSessionsService, 'findCurrentSessionForUser')
        .mockRejectedValueOnce(new Error('ShoppingSession not found'));

      await expect(controller.getShoppingSessionOfCurrentUser(mockDecodedToken)).rejects.toThrow(
        'ShoppingSession not found'
      );
      expect(shoppingSessionsService.findCurrentSessionForUser).toHaveBeenCalledWith(mockDecodedToken.email);
      expect(shoppingSessionsService.findCurrentSessionForUser).toHaveBeenCalledTimes(1);
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
});
