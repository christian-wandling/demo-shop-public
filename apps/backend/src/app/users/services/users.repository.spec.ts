import { Test } from '@nestjs/testing';
import { PrismaService } from '../../common/services/prisma.service';
import { UsersRepository } from './users.repository';
import { HydratedUser } from '../entities/hydrated-user';
import { CreateUserDTO } from '../dtos/create-user-dto';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    user: {
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockUser: HydratedUser = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'test@example.com',
    keycloakUserId: '12345',
    phone: 'phone',
    address: {
      id: 1,
      street: '123 Main St',
      city: 'Test City',
      userId: 1,
      apartment: 'apartment',
      zip: 'zip',
      region: 'region',
      country: 'country',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
    deletedAt: null,
  };

  const dto: CreateUserDTO = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'test@example.com',
    keycloakUserId: '12345',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
    prismaService = moduleRef.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    const email = 'test@example.com';

    it('should find a user by email with address included', async () => {
      mockPrismaService.user.findUniqueOrThrow.mockResolvedValue(mockUser);

      const result = await usersRepository.find(email);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { email },
        include: { address: true },
      });
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    });

    it('should throw when user is not found', async () => {
      mockPrismaService.user.findUniqueOrThrow.mockRejectedValue(new Error('User not found'));

      await expect(usersRepository.find(email)).rejects.toThrow('User not found');
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { email },
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
          keycloakUserId: dto.keycloakUserId,
        },
        include: { address: true },
      });
    });

    it('should throw an error if user creation fails', async () => {
      mockPrismaService.user.create.mockRejectedValue(new Error('Database error'));

      await expect(usersRepository.create(dto)).rejects.toThrow('Database error');
    });
  });
});
