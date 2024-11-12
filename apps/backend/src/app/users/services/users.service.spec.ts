import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { NotFoundException } from '@nestjs/common';
import { HydratedUser } from '../entities/hydrated-user';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  const mockUser: HydratedUser = {
    id: 1,
    email: 'test@example.com',
    deleted: false,
    deletedAt: undefined,
    firstname: 'firstname',
    keycloakUser: 'keycloakUser',
    lastname: 'lastname',
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

  const mockUserDTO = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
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

  describe('findByEmail', () => {
    it('should return a user DTO when user exists', async () => {
      repository.find.mockResolvedValue(mockUser);

      await service.findByEmail('test@example.com');

      expect(repository.find).toHaveBeenCalledWith('test@example.com');
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      repository.find.mockResolvedValue(null);

      await expect(service.findByEmail('nonexistent@example.com')).rejects.toThrow(NotFoundException);

      expect(repository.find).toHaveBeenCalledWith('nonexistent@example.com');
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });
});
