import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HydratedUser } from '../entities/hydrated-user';
import { DecodedToken } from '../../common/models/decoded-token';
import { UserIdentity } from '../dtos/user-identity';
import { UserResponse } from '../dtos/user-response';
import { MonitoringService } from '../../common/services/monitoring.service';

describe('UserService', () => {
  let service: UserService;
  let monitoringService: MonitoringService;
  let repository: jest.Mocked<UserRepository>;

  const mockUser: HydratedUser = {
    id: 1,
    email: 'john.doe@email.com',
    firstname: 'john',
    lastname: 'doe',
    keycloak_user_id: 'id',
    deleted: false,
    deleted_at: undefined,
    phone: 'phone',
    address: {
      id: 1,
      user_id: 1,
      street: 'street',
      apartment: 'apartment',
      city: 'city',
      zip: 'zip',
      region: 'region',
      country: 'country',
      created_at: new Date(),
      updated_at: new Date(),
    },
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockUserResponse: UserResponse = {
    id: 1,
    email: 'john.doe@email.com',
    firstname: 'john',
    lastname: 'doe',
    phone: 'phone',
    address: {
      street: 'street',
      apartment: 'apartment',
      city: 'city',
      zip: 'zip',
      region: 'region',
      country: 'country',
    },
  };

  const mockDecodedToken: DecodedToken = {
    given_name: 'john',
    family_name: 'doe',
    sub: 'id',
    email: 'john.doe@email.com',
  };

  const mockCreateUserDto: UserIdentity = {
    firstname: 'john',
    lastname: 'doe',
    keycloakUserId: 'id',
    email: 'john.doe@email.com',
  };

  beforeEach(async () => {
    const mockRepository = {
      findByKeycloakId: jest.fn(),
      create: jest.fn(),
      updateAddress: jest.fn(),
      updatePhone: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
        {
          provide: MonitoringService,
          useValue: {
            setUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);
    monitoringService = module.get(MonitoringService);
  });

  describe('getFromToken', () => {
    it('should create a user if not found', async () => {
      jest.spyOn(repository, 'findByKeycloakId').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockResolvedValue(mockUser);
      jest.spyOn(service, 'createUser').mockResolvedValue(mockUserResponse);

      const result = await service.resolveCurrentUser(mockDecodedToken);
      expect(result).toEqual(mockUserResponse);
      expect(service.createUser).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should return existing user if found', async () => {
      jest.spyOn(repository, 'findByKeycloakId').mockResolvedValue(mockUser);

      const result = await service.resolveCurrentUser(mockDecodedToken);
      expect(result).toEqual(mockUserResponse);
      expect(repository.create).not.toHaveBeenCalled();
      expect(monitoringService.setUser).toHaveBeenCalledWith({ id: mockUserResponse.id });
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(mockUser);

      const result = await service.createUser(mockCreateUserDto);
      expect(result).toEqual(mockUserResponse);
      expect(monitoringService.setUser).toHaveBeenCalledWith({ id: mockUserResponse.id });
    });

    it('should throw the right exception if user creation fails', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(null);

      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateCurrentUserAddress', () => {
    it('should update the address of a user successfully', async () => {
      jest.spyOn(repository, 'updateAddress').mockResolvedValue(mockUser.address);
      jest.spyOn(repository, 'findByKeycloakId').mockResolvedValue(mockUser);

      const result = await service.updateCurrentUserAddress(mockDecodedToken, mockUser.address);
      expect(result).toEqual(mockUserResponse.address);
    });

    it('should throw the right exception if no user found', async () => {
      jest.spyOn(repository, 'findByKeycloakId').mockResolvedValue(null);

      await expect(service.updateCurrentUserAddress(mockDecodedToken, mockUser.address)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw the right exception if update returns no result', async () => {
      jest.spyOn(repository, 'updateAddress').mockResolvedValue(null);
      jest.spyOn(repository, 'findByKeycloakId').mockResolvedValue(mockUser);

      await expect(service.updateCurrentUserAddress(mockDecodedToken, mockUser.address)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('updateCurrentUserPhone', () => {
    it('should update the phone of a user successfully', async () => {
      jest.spyOn(repository, 'updatePhone').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'findByKeycloakId').mockResolvedValue(mockUser);

      const result = await service.updateCurrentUserPhone(mockDecodedToken, { phone: mockUser.phone });
      expect(result).toEqual(mockUserResponse);
    });

    it('should throw the right exception if no user found', async () => {
      jest.spyOn(repository, 'findByKeycloakId').mockResolvedValue(null);

      await expect(service.updateCurrentUserPhone(mockDecodedToken, { phone: mockUser.phone })).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw the right exception if update returns no result', async () => {
      jest.spyOn(repository, 'updatePhone').mockResolvedValue(null);
      jest.spyOn(repository, 'findByKeycloakId').mockResolvedValue(mockUser);

      await expect(service.updateCurrentUserPhone(mockDecodedToken, { phone: mockUser.phone })).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
