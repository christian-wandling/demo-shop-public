import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { UserDTO } from './dtos/user-dto';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { RequestMethod } from '@nestjs/common';
import { DecodedToken } from '../common/entities/decoded-token';
import { MonitoringService } from '../common/services/monitoring.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let monitoringService: MonitoringService;

  const mockUserDto: UserDTO = {
    address: undefined,
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
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getFromToken: jest.fn().mockResolvedValue(mockUserDto),
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

    controller = module.get(UsersController);
    usersService = module.get(UsersService);
    monitoringService = module.get(MonitoringService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('UserController', () => {
    it('should have correct path', () => {
      const path = Reflect.getMetadata('path', UsersController);
      expect(path).toBe('users');
    });

    it('should have correct version', () => {
      const version = Reflect.getMetadata('__version__', UsersController);
      expect(version).toBe('1');
    });

    it('should have the correct roles', () => {
      const roles = Reflect.getMetadata('roles', UsersController);
      expect(roles).toEqual({ roles: ['realm:buy_products'] });
    });
  });

  describe('getCurrentUser', () => {
    it('should return a user by email', async () => {
      const result = await controller.getCurrentUser(mockDecodedToken);

      expect(result).toEqual(mockUserDto);
      expect(usersService.getFromToken).toHaveBeenCalledWith(mockDecodedToken);
      expect(usersService.getFromToken).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(usersService, 'getFromToken').mockRejectedValueOnce(new Error('User not found'));

      await expect(controller.getCurrentUser(mockDecodedToken)).rejects.toThrow('User not found');
      expect(usersService.getFromToken).toHaveBeenCalledWith(mockDecodedToken);
      expect(usersService.getFromToken).toHaveBeenCalledTimes(1);
    });

    it('should set the user id', async () => {
      await controller.getCurrentUser(mockDecodedToken);

      expect(monitoringService.setUser).toHaveBeenCalledWith({ id: mockUserDto.id });
      expect(monitoringService.setUser).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', UsersController.prototype.getCurrentUser);
      expect(path).toEqual('me');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', UsersController.prototype.getCurrentUser);
      expect(method).toEqual(RequestMethod.GET);
    });
  });
});
