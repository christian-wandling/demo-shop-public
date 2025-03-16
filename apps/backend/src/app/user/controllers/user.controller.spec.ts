import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { UserResponse } from '../dtos/user-response';
import { DecodeTokenPipe } from '../../common/pipes/decode-token-pipe';
import { BadRequestException, NotFoundException, RequestMethod } from '@nestjs/common';
import { DecodedToken } from '../../common/models/decoded-token';
import { MonitoringService } from '../../common/services/monitoring.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserResponse: UserResponse = {
    address: {
      street: 'street',
      apartment: 'apartment',
      city: 'city',
      region: 'region',
      zip: 'zip',
      country: 'country',
    },
    firstname: 'firstname',
    lastname: 'lastname',
    phone: 'phone',
    id: 1,
    email: 'test@example.com',
  };

  const mockDecodedToken: DecodedToken = {
    given_name: 'given_name',
    family_name: 'family_name',
    sub: 'sub',
    email: 'email@email.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            resolveCurrentUser: jest.fn().mockResolvedValue(mockUserResponse),
            updateCurrentUserAddress: jest.fn().mockResolvedValue(mockUserResponse.address),
            updateCurrentUserPhone: jest.fn().mockResolvedValue(mockUserResponse),
          },
        },
        {
          provide: MonitoringService,
          useValue: {
            setUser: jest.fn(),
          },
        },
      ],
    })
      .overridePipe(DecodeTokenPipe)
      .useValue(jest.fn().mockReturnValue(mockDecodedToken))
      .compile();

    controller = module.get(UserController);
    userService = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('UserController', () => {
    it('should have correct path', () => {
      const path = Reflect.getMetadata('path', UserController);
      expect(path).toBe('users');
    });

    it('should have correct version', () => {
      const version = Reflect.getMetadata('__version__', UserController);
      expect(version).toBe('1');
    });

    it('should have the correct roles', () => {
      const roles = Reflect.getMetadata('roles', UserController);
      expect(roles).toEqual({ roles: ['realm:buy_products'] });
    });
  });

  describe('resolveCurrentUser', () => {
    it('should resolve the current user', async () => {
      const result = await controller.resolveCurrentUser(mockDecodedToken);

      expect(result).toEqual(mockUserResponse);
      expect(userService.resolveCurrentUser).toHaveBeenCalledWith(mockDecodedToken);
      expect(userService.resolveCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user is not found', async () => {
      jest
        .spyOn(userService, 'resolveCurrentUser')
        .mockRejectedValueOnce(new BadRequestException('Failed to create user'));

      await expect(controller.resolveCurrentUser(mockDecodedToken)).rejects.toThrow('Failed to create user');
      expect(userService.resolveCurrentUser).toHaveBeenCalledWith(mockDecodedToken);
      expect(userService.resolveCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', UserController.prototype.resolveCurrentUser);
      expect(path).toEqual('me');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', UserController.prototype.resolveCurrentUser);
      expect(method).toEqual(RequestMethod.POST);
    });
  });

  describe('updateCurrentUserAddress', () => {
    it('should update the address of current user', async () => {
      const result = await controller.updateCurrentUserAddress(mockUserResponse.address, mockDecodedToken);

      expect(result).toEqual(mockUserResponse.address);
      expect(userService.updateCurrentUserAddress).toHaveBeenCalledWith(mockDecodedToken, mockUserResponse.address);
      expect(userService.updateCurrentUserAddress).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user is not found', async () => {
      jest
        .spyOn(userService, 'updateCurrentUserAddress')
        .mockRejectedValueOnce(new NotFoundException('User not found'));

      await expect(controller.updateCurrentUserAddress(mockUserResponse.address, mockDecodedToken)).rejects.toThrow(
        new NotFoundException('User not found')
      );
      expect(userService.updateCurrentUserAddress).toHaveBeenCalledWith(mockDecodedToken, mockUserResponse.address);
      expect(userService.updateCurrentUserAddress).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', UserController.prototype.updateCurrentUserAddress);
      expect(path).toEqual('me/address');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', UserController.prototype.updateCurrentUserAddress);
      expect(method).toEqual(RequestMethod.PUT);
    });
  });

  describe('updateCurrentUserPhone', () => {
    it('should update the phone of current user', async () => {
      const result = await controller.updateCurrentUserPhone({ phone: mockUserResponse.phone }, mockDecodedToken);

      expect(result).toEqual(mockUserResponse);
      expect(userService.updateCurrentUserPhone).toHaveBeenCalledWith(mockDecodedToken, {
        phone: mockUserResponse.phone,
      });
      expect(userService.updateCurrentUserPhone).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(userService, 'updateCurrentUserPhone').mockRejectedValueOnce(new NotFoundException('User not found'));

      await expect(
        controller.updateCurrentUserPhone({ phone: mockUserResponse.phone }, mockDecodedToken)
      ).rejects.toThrow(new NotFoundException('User not found'));
      expect(userService.updateCurrentUserPhone).toHaveBeenCalledWith(mockDecodedToken, {
        phone: mockUserResponse.phone,
      });
      expect(userService.updateCurrentUserPhone).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', UserController.prototype.updateCurrentUserPhone);
      expect(path).toEqual('me/phone');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', UserController.prototype.updateCurrentUserPhone);
      expect(method).toEqual(RequestMethod.PATCH);
    });
  });
});
