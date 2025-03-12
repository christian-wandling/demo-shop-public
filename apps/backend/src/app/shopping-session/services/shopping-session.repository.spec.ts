import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/services/prisma.service';
import { ShoppingSessionRepository } from './shopping-session.repository';
import { OrderStatus, ShoppingSession } from '@prisma/client';
import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateOrderDto } from '../../order/dtos/create-order-dto';
import { HydratedOrder } from '../../order/entities/hydrated-order';

describe('ShoppingSessionsRepository', () => {
  let repository: ShoppingSessionRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockEmail = 'test@example.com';
  const mockSessionId = 1;

  const mockHydratedSession: HydratedShoppingSession = {
    id: mockSessionId,
    user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    cart_items: [
      {
        id: 1,
        shopping_session_id: mockSessionId,
        product_id: 1,
        quantity: 1,
        created_at: new Date(),
        updated_at: new Date(),
        product: {
          id: 1,
          name: 'Test Product',
          price: new Decimal(100.0),
          description: 'Test Description',
          created_at: new Date(),
          updated_at: new Date(),
          deleted: false,
          deleted_at: undefined,
          images: [
            {
              id: 1,
              product_id: 1,
              uri: 'test-url',
              created_at: new Date(),
              updated_at: new Date(),
              name: '',
              deleted: false,
              deleted_at: undefined,
            },
          ],
        },
      },
    ],
  };

  const mockSession: ShoppingSession = {
    id: mockSessionId,
    user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingSessionRepository,
        {
          provide: PrismaService,
          useValue: {
            shoppingSession: {
              findFirst: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
            },
            order: {
              create: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<ShoppingSessionRepository>(ShoppingSessionRepository);
    prismaService = module.get(PrismaService);
  });

  describe('find', () => {
    it('should find the most recent shopping session for a user', async () => {
      jest.spyOn(prismaService.shoppingSession, 'findFirst').mockResolvedValue(mockHydratedSession);

      const result = await repository.find(mockEmail);

      expect(prismaService.shoppingSession.findFirst).toHaveBeenCalledWith({
        orderBy: {
          created_at: 'desc',
        },
        where: {
          user: {
            email: mockEmail,
          },
        },
        include: {
          cart_items: {
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
          cart_items: {
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

      const result = await repository.remove(mockSessionId, mockEmail);

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

      await expect(repository.remove(mockSessionId, mockEmail)).rejects.toThrow('Session not found');
    });
  });

  describe('checkout', () => {
    const mockDto: CreateOrderDto = {
      shoppingSessionId: 1,
      userId: 1,
      items: [
        {
          product_id: 1,
          product_name: 'Test Product',
          product_thumbnail: 'thumbnail.jpg',
          quantity: 2,
          price: 10.99,
        },
      ],
    };

    const mockCreatedOrder: HydratedOrder = {
      id: 1,
      user_id: 1,
      status: OrderStatus.Created,
      deleted: false,
      created_at: undefined,
      updated_at: undefined,
      deleted_at: undefined,
      order_items: [
        {
          id: 1,
          order_id: 1,
          product_id: 1,
          product_name: 'Test Product',
          product_thumbnail: 'thumbnail.jpg',
          quantity: 2,
          price: new Decimal(10.99),
          deleted: false,
          created_at: undefined,
          updated_at: undefined,
          deleted_at: undefined,
        },
      ],
    };

    it('should create an order and delete the current shopping session', async () => {
      const mockCreateOperation = {
        data: {
          user: {
            connect: { id: 1 },
          },
          order_items: {
            createMany: {
              data: [
                {
                  product_id: 1,
                  product_name: 'Test Product',
                  product_thumbnail: 'thumbnail.jpg',
                  quantity: 2,
                  price: 10.99,
                },
              ],
            },
          },
          status: 'Created',
        },
        include: {
          order_items: true,
        },
      };

      const mockDeleteOperation = {
        where: {
          id: 1,
        },
      };

      jest.spyOn(prismaService.order, 'create').mockResolvedValue(mockCreatedOrder);
      jest.spyOn(prismaService.shoppingSession, 'delete').mockResolvedValue(mockSession);
      jest.spyOn(prismaService, '$transaction').mockResolvedValue([mockCreatedOrder]);

      const result = await repository.checkout(mockDto);

      expect(prismaService.order.create).toHaveBeenCalledWith(mockCreateOperation);
      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(prismaService.shoppingSession.delete).toHaveBeenCalledWith(mockDeleteOperation);
      expect(result).toEqual(mockCreatedOrder);
    });

    it('should throw an error if transaction fails', async () => {
      prismaService.$transaction.mockRejectedValue(new Error('Transaction failed'));

      await expect(repository.checkout(mockDto)).rejects.toThrow('Transaction failed');
    });
  });
});
