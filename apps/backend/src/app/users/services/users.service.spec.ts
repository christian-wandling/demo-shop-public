import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { BadRequestException } from '@nestjs/common';
import { HydratedUser } from '../entities/hydrated-user';
import { DecodedToken } from '../../common/entities/decoded-token';
import { CreateUserDTO } from '../dtos/create-user-dto';
import { UserDTO } from '../dtos/user-dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  const mockUser: HydratedUser = {
    id: 1,
    email: 'john.doe@email.com',
    firstname: 'john',
    lastname: 'doe',
    keycloakUserId: 'id',
    deleted: false,
    deletedAt: undefined,
    phone: 'phone',
    address: {
      id: 1,
      userId: 1,
      street: 'street',
      apartment: 'apartment',
      city: 'city',
      zip: 'zip',
      region: 'region',
      country: 'country',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserDto: UserDTO = {
    id: '1',
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

  const mockCreateUserDto: CreateUserDTO = {
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
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
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
