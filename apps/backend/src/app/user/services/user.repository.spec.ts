import { Test } from '@nestjs/testing';
import { PrismaService } from '../../common/services/prisma.service';
import { UserRepository } from './user.repository';
import { HydratedUser } from '../entities/hydrated-user';
import { UserIdentity } from '../dtos/user-identity';

describe('UsersRepository', () => {
  let usersRepository: UserRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockUser: HydratedUser = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'test@example.com',
    keycloak_user_id: '12345',
    phone: 'phone',
    address: {
      id: 1,
      street: '123 Main St',
      city: 'Test City',
      user_id: 1,
      apartment: 'apartment',
      zip: 'zip',
      region: 'region',
      country: 'country',
      created_at: new Date(),
      updated_at: new Date(),
    },
    created_at: new Date(),
    updated_at: new Date(),
    deleted: false,
    deleted_at: null,
  };

  const dto: UserIdentity = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'test@example.com',
    keycloakUserId: '12345',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    usersRepository = moduleRef.get<UserRepository>(UserRepository);
    prismaService = moduleRef.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    const keycloakId = 'keycloakId';

    it('should find a user by email with address included', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await usersRepository.findByKeycloakId(keycloakId);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { keycloak_user_id: keycloakId, deleted: false },
        include: { address: true },
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw when user is not found', async () => {
      mockPrismaService.user.findUnique.mockRejectedValue(new Error('User not found'));

      await expect(usersRepository.findByKeycloakId(keycloakId)).rejects.toThrow('User not found');
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { keycloak_user_id: keycloakId, deleted: false },
        include: { address: true },
      });
    });
  });

  describe('create', () => {
    it('should create a user and return the created user with address', async () => {
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await usersRepository.create(dto);
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          firstname: dto.firstname,
          lastname: dto.lastname,
          email: dto.email,
          keycloak_user_id: dto.keycloakUserId,
        },
        include: { address: true },
      });
    });

    it('should throw an error if user creation fails', async () => {
      mockPrismaService.user.create.mockRejectedValue(new Error('Database error'));

      await expect(usersRepository.create(dto)).rejects.toThrow('Database error');
    });
  });

  describe('updateAddress', () => {
    it('should update the address of a user and return the address of the user', async () => {
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await usersRepository.updateAddress(mockUser, mockUser.address);
      expect(result).toEqual(mockUser.address);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: mockUser.id,
        },
        data: {
          address: {
            upsert: {
              create: mockUser.address,
              update: mockUser.address,
            },
          },
        },
        include: { address: true },
      });
    });

    it('should throw an error if updating address fails', async () => {
      mockPrismaService.user.update.mockRejectedValue(new Error('Database error'));

      await expect(usersRepository.updateAddress(mockUser, mockUser.address)).rejects.toThrow('Database error');
    });
  });

  describe('updatePhone', () => {
    it('should update the phone of a user and return the user', async () => {
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await usersRepository.updatePhone(mockUser, { phone: mockUser.phone });
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: mockUser.id,
        },
        data: {
          phone: mockUser.phone,
        },
        include: { address: true },
      });
    });

    it('should throw an error if updating phone fails', async () => {
      mockPrismaService.user.update.mockRejectedValue(new Error('Database error'));

      await expect(usersRepository.updatePhone(mockUser, { phone: mockUser.phone })).rejects.toThrow('Database error');
    });
  });
});
