import { Test } from '@nestjs/testing';
import { PrismaService } from '../../common/services/prisma.service';
import { UsersRepository } from './users.repository';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    user: {
      findUniqueOrThrow: jest.fn(),
    },
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    address: {
      id: 1,
      street: '123 Main St',
      city: 'Test City',
      userId: 1,
    },
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
});
