import { Test } from '@nestjs/testing';
import { OrderRepository } from './order.repository';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedOrder } from '../entities/hydrated-order';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderStatus } from '@prisma/client';

describe('OrdersRepository', () => {
  let repository: OrderRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    order: {
      findUniqueOrThrow: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockKeycloakId = 'keycloakId';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrderRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = moduleRef.get<OrderRepository>(OrderRepository);
    prismaService = moduleRef.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    const mockOrder: HydratedOrder = {
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

    it('should find an order by id and email', async () => {
      jest.spyOn(prismaService.order, 'findUniqueOrThrow').mockResolvedValue(mockOrder);

      const result = await repository.find(1, mockKeycloakId);

      expect(prismaService.order.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: 1,
          user: {
            keycloak_user_id: mockKeycloakId,
          },
          deleted: false,
        },
        include: {
          order_items: {
            where: {
              deleted: false,
            },
          },
        },
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw an error when order is not found', async () => {
      jest.spyOn(prismaService.order, 'findUniqueOrThrow').mockRejectedValue(new Error('Not found'));

      await expect(repository.find(1, mockKeycloakId)).rejects.toThrow('Not found');
    });
  });

  describe('findManyByUser', () => {
    const mockOrders: HydratedOrder[] = [
      {
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
            product_name: 'Test Product 1',
            product_thumbnail: 'thumbnail1.jpg',
            quantity: 2,
            price: new Decimal(10.99),
            deleted: false,
            created_at: undefined,
            updated_at: undefined,
            deleted_at: undefined,
          },
        ],
      },
    ];

    it('should find all orders for a user', async () => {
      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue(mockOrders);

      const result = await repository.findManyByUser(mockKeycloakId);

      expect(prismaService.order.findMany).toHaveBeenCalledWith({
        where: {
          user: {
            keycloak_user_id: mockKeycloakId,
          },
          deleted: false,
        },
        include: {
          order_items: {
            where: {
              deleted: false,
            },
          },
        },
      });
      expect(result).toEqual(mockOrders);
    });
  });
});
