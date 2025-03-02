import { Test } from '@nestjs/testing';
import { OrderRepository } from './order.repository';
import { PrismaService } from '../../common/services/prisma.service';
import { ShoppingSessionResponse } from '../../shopping-session/dtos/shopping-session-response';
import { HydratedOrder } from '../entities/hydrated-order';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderStatus, ShoppingSession } from '@prisma/client';
import { CreateOrderDto } from '../dtos/create-order-dto';

describe('OrdersRepository', () => {
  let repository: OrderRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    order: {
      findUniqueOrThrow: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    shoppingSession: {
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

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

      const result = await repository.find(1, 'test@example.com');

      expect(prismaService.order.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: 1,
          user: {
            email: 'test@example.com',
          },
        },
        include: {
          order_items: true,
        },
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw an error when order is not found', async () => {
      jest.spyOn(prismaService.order, 'findUniqueOrThrow').mockRejectedValue(new Error('Not found'));

      await expect(repository.find(1, 'test@example.com')).rejects.toThrow('Not found');
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

      const result = await repository.findManyByUser('test@example.com');

      expect(prismaService.order.findMany).toHaveBeenCalledWith({
        where: {
          user: {
            email: 'test@example.com',
          },
        },
        include: {
          order_items: true,
        },
      });
      expect(result).toEqual(mockOrders);
    });
  });

  describe('create', () => {
    const mockDto: CreateOrderDto = {
      shoppingSessionId: 1,
      userId: 1,
      items: [
        {
          id: 1,
          productId: 1,
          productName: 'Test Product',
          productThumbnail: 'thumbnail.jpg',
          quantity: 2,
          unitPrice: 10.99,
          totalPrice: 21.98,
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

    const mockShoppingSession: ShoppingSession = {
      id: 1,
      user_id: 1,
      created_at: undefined,
      updated_at: undefined,
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
      jest.spyOn(prismaService.shoppingSession, 'delete').mockResolvedValue(mockShoppingSession);
      jest.spyOn(prismaService, '$transaction').mockResolvedValue([mockCreatedOrder]);

      const result = await repository.create(mockDto);

      expect(prismaService.order.create).toHaveBeenCalledWith(mockCreateOperation);
      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(prismaService.shoppingSession.delete).toHaveBeenCalledWith(mockDeleteOperation);
      expect(result).toEqual(mockCreatedOrder);
    });

    it('should throw an error if transaction fails', async () => {
      prismaService.$transaction.mockRejectedValue(new Error('Transaction failed'));

      await expect(repository.create(mockDto)).rejects.toThrow('Transaction failed');
    });
  });
});
