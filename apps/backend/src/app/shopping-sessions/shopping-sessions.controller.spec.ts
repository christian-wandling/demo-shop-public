import { Test, TestingModule } from '@nestjs/testing';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { ShoppingSessionsController } from './shopping-sessions.controller';
import { ShoppingSessionsService } from './services/shopping-sessions.service';
import { ShoppingSessionDTO } from './dtos/shopping-session-dto';
import { RequestMethod } from '@nestjs/common';
import { DecodedToken } from '../common/entities/decoded-token';

describe('ShoppingSessionsController', () => {
  let controller: ShoppingSessionsController;
  let shoppingSessionsService: ShoppingSessionsService;

  const shoppingSessionDTO: ShoppingSessionDTO = {
    id: '1',
    userId: '1',
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
      controllers: [ShoppingSessionsController],
      providers: [
        {
          provide: ShoppingSessionsService,
          useValue: {
            create: jest.fn().mockResolvedValue(shoppingSessionDTO),
            findCurrentSessionForUser: jest.fn().mockResolvedValue(shoppingSessionDTO),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    })
      .overridePipe(DecodeTokenPipe)
      .useValue(jest.fn().mockReturnValue(mockDecodedToken))
      .compile();

    controller = module.get(ShoppingSessionsController);
    shoppingSessionsService = module.get(ShoppingSessionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ShoppingSessionController', () => {
    it('should have correct path', () => {
      const path = Reflect.getMetadata('path', ShoppingSessionsController);
      expect(path).toBe('shopping-sessions');
    });

    it('should have correct version', () => {
      const version = Reflect.getMetadata('__version__', ShoppingSessionsController);
      expect(version).toBe('1');
    });

    it('should have the correct roles', () => {
      const roles = Reflect.getMetadata('roles', ShoppingSessionsController);
      expect(roles).toEqual({ roles: ['realm:buy_products'] });
    });
  });

  describe('createShoppingSession', () => {
    it('should create a shopping session by email', async () => {
      const email = 'test@example.com';

      const result = await controller.createShoppingSession(mockDecodedToken);

      expect(result).toEqual(shoppingSessionDTO);
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
      const path = Reflect.getMetadata('path', ShoppingSessionsController.prototype.createShoppingSession);
      expect(path).toEqual('/');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', ShoppingSessionsController.prototype.createShoppingSession);
      expect(method).toEqual(RequestMethod.POST);
    });
  });

  describe('getCurrentShoppingSession', () => {
    it('should return a shopping session by email', async () => {
      const result = await controller.getShoppingSessionOfCurrentUser(mockDecodedToken);

      expect(result).toEqual(shoppingSessionDTO);
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
      const path = Reflect.getMetadata('path', ShoppingSessionsController.prototype.getShoppingSessionOfCurrentUser);
      expect(path).toEqual('current');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata(
        'method',
        ShoppingSessionsController.prototype.getShoppingSessionOfCurrentUser
      );
      expect(method).toEqual(RequestMethod.GET);
    });
  });

  describe('removeShoppingSession', () => {
    it('should delete a shopping session by id and email', async () => {
      const id = '1';

      const result = await controller.removeShoppingSession(id, mockDecodedToken);

      expect(result).toEqual(undefined);
      expect(shoppingSessionsService.remove).toHaveBeenCalledWith(id, mockDecodedToken.email);
      expect(shoppingSessionsService.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if shopping session is not found', async () => {
      const id = '1';
      jest.spyOn(shoppingSessionsService, 'remove').mockRejectedValueOnce(new Error('ShoppingSession not found'));

      await expect(controller.removeShoppingSession(id, mockDecodedToken)).rejects.toThrow('ShoppingSession not found');
      expect(shoppingSessionsService.remove).toHaveBeenCalledWith(id, mockDecodedToken.email);
      expect(shoppingSessionsService.remove).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', ShoppingSessionsController.prototype.removeShoppingSession);
      expect(path).toEqual(':id');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', ShoppingSessionsController.prototype.removeShoppingSession);
      expect(method).toEqual(RequestMethod.DELETE);
    });
  });
});
