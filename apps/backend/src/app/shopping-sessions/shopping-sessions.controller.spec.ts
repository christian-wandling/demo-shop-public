import { Test, TestingModule } from '@nestjs/testing';
import { EmailFromTokenPipe } from '../common/pipes/email-from-token.pipe';
import { ShoppingSessionsController } from './shopping-sessions.controller';
import { ShoppingSessionsService } from './services/shopping-sessions.service';
import { ShoppingSessionDTO } from './dtos/shopping-session-dto';
import { RequestMethod } from '@nestjs/common';

describe('ShoppingSessionsController', () => {
  let controller: ShoppingSessionsController;
  let shoppingSessionsService: ShoppingSessionsService;

  const email = 'email@email.com';

  const shoppingSessionDTO: ShoppingSessionDTO = {
    id: '1',
    userId: '1',
    items: [],
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
      .overridePipe(EmailFromTokenPipe)
      .useValue(jest.fn().mockReturnValue(email))
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
      expect(roles).toEqual({ roles: ['buy_products'] });
    });
  });

  describe('createShoppingSession', () => {
    it('should create a shopping session by email', async () => {
      const email = 'test@example.com';

      const result = await controller.createShoppingSession(email);

      expect(result).toEqual(shoppingSessionDTO);
      expect(shoppingSessionsService.create).toHaveBeenCalledWith(email);
      expect(shoppingSessionsService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if shopping session could not be created', async () => {
      const email = 'nonexistent@example.com';
      jest.spyOn(shoppingSessionsService, 'create').mockRejectedValueOnce(new Error('ShoppingSession not found'));

      await expect(controller.createShoppingSession(email)).rejects.toThrow('ShoppingSession not found');
      expect(shoppingSessionsService.create).toHaveBeenCalledWith(email);
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
      const email = 'test@example.com';

      const result = await controller.getShoppingSessionOfCurrentUser(email);

      expect(result).toEqual(shoppingSessionDTO);
      expect(shoppingSessionsService.findCurrentSessionForUser).toHaveBeenCalledWith(email);
      expect(shoppingSessionsService.findCurrentSessionForUser).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if shopping session is not found', async () => {
      const email = 'nonexistent@example.com';
      jest
        .spyOn(shoppingSessionsService, 'findCurrentSessionForUser')
        .mockRejectedValueOnce(new Error('ShoppingSession not found'));

      await expect(controller.getShoppingSessionOfCurrentUser(email)).rejects.toThrow('ShoppingSession not found');
      expect(shoppingSessionsService.findCurrentSessionForUser).toHaveBeenCalledWith(email);
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
      const email = 'test@example.com';
      const id = '1';

      const result = await controller.removeShoppingSession(id, email);

      expect(result).toEqual(undefined);
      expect(shoppingSessionsService.remove).toHaveBeenCalledWith(id, email);
      expect(shoppingSessionsService.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if shopping session is not found', async () => {
      const email = 'nonexistent@example.com';
      const id = '1';
      jest.spyOn(shoppingSessionsService, 'remove').mockRejectedValueOnce(new Error('ShoppingSession not found'));

      await expect(controller.removeShoppingSession(id, email)).rejects.toThrow('ShoppingSession not found');
      expect(shoppingSessionsService.remove).toHaveBeenCalledWith(id, email);
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
