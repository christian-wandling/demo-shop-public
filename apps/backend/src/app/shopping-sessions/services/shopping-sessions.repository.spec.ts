import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/services/prisma.service';
import { ShoppingSessionsRepository } from './shopping-sessions.repository';
import { ShoppingSession } from '@prisma/client';
import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { Decimal } from '@prisma/client/runtime/library';

describe('ShoppingSessionsRepository', () => {
  let repository: ShoppingSessionsRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockEmail = 'test@example.com';
  const mockSessionId = 1;

  const mockHydratedSession: HydratedShoppingSession = {
    id: mockSessionId,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    cartItems: [
      {
        id: 1,
        shoppingSessionId: mockSessionId,
        productId: 1,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: {
          id: 1,
          name: 'Test Product',
          price: new Decimal(100.0),
          description: 'Test Description',
          createdAt: new Date(),
          updatedAt: new Date(),
          deleted: false,
          deletedAt: undefined,
          images: [
            {
              id: 1,
              productId: 1,
              uri: 'test-url',
              createdAt: new Date(),
              updatedAt: new Date(),
              name: '',
              deleted: false,
              deletedAt: undefined,
            },
          ],
        },
      },
    ],
  };

  const mockSession: ShoppingSession = {
    id: mockSessionId,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingSessionsRepository,
        {
          provide: PrismaService,
          useValue: {
            shoppingSession: {
              findFirst: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<ShoppingSessionsRepository>(ShoppingSessionsRepository);
    prismaService = module.get(PrismaService);
  });

  describe('find', () => {
    it('should find the most recent shopping session for a user', async () => {
      jest.spyOn(prismaService.shoppingSession, 'findFirst').mockResolvedValue(mockHydratedSession);

      const result = await repository.find(mockEmail);

      expect(prismaService.shoppingSession.findFirst).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          user: {
            email: mockEmail,
          },
        },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(mockHydratedSession);
    });

    it('should return null when no session is found', async () => {
      jest.spyOn(prismaService.shoppingSession, 'findFirst').mockResolvedValue(null);

      const result = await repository.find(mockEmail);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new shopping session', async () => {
      jest.spyOn(prismaService.shoppingSession, 'create').mockResolvedValue(mockHydratedSession);

      const result = await repository.create(mockEmail);

      expect(prismaService.shoppingSession.create).toHaveBeenCalledWith({
        data: {
          user: {
            connect: { email: mockEmail },
          },
        },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(mockHydratedSession);
    });
  });

  describe('remove', () => {
    it('should remove a shopping session', async () => {
      jest.spyOn(prismaService.shoppingSession, 'delete').mockResolvedValue(mockSession);

      const result = await repository.remove(mockSessionId.toString(), mockEmail);

      expect(prismaService.shoppingSession.delete).toHaveBeenCalledWith({
        where: {
          id: mockSessionId,
          user: {
            email: mockEmail,
          },
        },
      });
      expect(result).toEqual(mockSession);
    });

    it('should throw an error when session is not found', async () => {
      jest.spyOn(prismaService.shoppingSession, 'delete').mockRejectedValue(new Error('Session not found'));

      await expect(repository.remove(mockSessionId.toString(), mockEmail)).rejects.toThrow('Session not found');
    });
  });
});
