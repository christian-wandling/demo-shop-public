import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { BadRequestException } from '@nestjs/common';
import { HydratedUser } from '../entities/hydrated-user';
import { DecodedToken } from '../../common/entities/decoded-token';
import { UserIdentity } from '../dtos/user-identity';
import { UserResponse } from '../dtos/user-response';

describe('UsersService', () => {
  let service: UserService;
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

  const mockUserDto: UserResponse = {
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
      find: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);
  });

  describe('getFromToken', () => {
    it('should create a user if not found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockResolvedValue(mockUser);
      jest.spyOn(service, 'createUser').mockResolvedValue(mockUserDto);

      const result = await service.getFromToken(mockDecodedToken);
      expect(result).toEqual(mockUserDto);
      expect(service.createUser).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should return existing user if found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(mockUser);

      const result = await service.getFromToken(mockDecodedToken);
      expect(result).toEqual(mockUserDto);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(mockUser);

      const result = await service.createUser(mockCreateUserDto);
      expect(result).toEqual(mockUserDto);
    });

    it('should throw the right exception if user creation fails', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(null);

      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(BadRequestException);
    });
  });
});
