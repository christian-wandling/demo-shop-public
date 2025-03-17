import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/services/prisma.service';
import { CartItemRepository } from './cart-item.repository';
import { UpdateCartItemQuantityRequest } from '../dtos/update-cart-item-quantity-request';
import { AddCartItemRequest } from '../dtos/add-cart-item-request';

describe('CartItemsRepository', () => {
  let repository: CartItemRepository;
  let prismaService: PrismaService;

  const mockPrismaService = {
    cartItem: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCartItem = {
    id: 1,
    quantity: 1,
    productId: 1,
    shoppingSessionId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    product: {
      id: 1,
      name: 'Test Product',
      price: 99.99,
      images: [{ id: 1, url: 'test-image.jpg' }],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<CartItemRepository>(CartItemRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a cart item with correct data', async () => {
      const createCartItemResponse: AddCartItemRequest = {
        productId: 1,
      };
      const shoppingSessionId = 1;
      mockPrismaService.cartItem.create.mockResolvedValue(mockCartItem);

      const result = await repository.create(createCartItemResponse, shoppingSessionId);

      expect(prismaService.cartItem.create).toHaveBeenCalledWith({
        data: {
          quantity: 1,
          product: {
            connect: {
              id: 1,
            },
          },
          shopping_session: {
            connect: {
              id: 1,
            },
          },
        },
        include: {
          product: {
            include: {
              images: {
                where: {
                  deleted: false,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(mockCartItem);
    });

    it('should throw an error if creation fails', async () => {
      const createCartItemResponse: AddCartItemRequest = {
        productId: 1,
      };
      const shoppingSessionId = 1;
      const error = new Error('Creation failed');
      mockPrismaService.cartItem.create.mockRejectedValue(error);

      await expect(repository.create(createCartItemResponse, shoppingSessionId)).rejects.toThrow('Creation failed');
    });
  });

  describe('update', () => {
    it('should update a cart item with correct data', async () => {
      const updateCartItemResponse: UpdateCartItemQuantityRequest = {
        quantity: 2,
      };
      const id = 1;
      const shoppingSessionId = 1;
      const updatedCartItem = { ...mockCartItem, quantity: 2 };
      mockPrismaService.cartItem.update.mockResolvedValue(updatedCartItem);

      const result = await repository.update(id, updateCartItemResponse, shoppingSessionId);

      expect(prismaService.cartItem.update).toHaveBeenCalledWith({
        where: {
          id: 1,
          shopping_session_id: 1,
        },
        data: {
          quantity: 2,
        },
        include: {
          product: {
            include: {
              images: {
                where: {
                  deleted: false,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(updatedCartItem);
    });

    it('should throw an error if update fails', async () => {
      const updateCartItemResponse: UpdateCartItemQuantityRequest = {
        quantity: 2,
      };
      const id = 1;
      const shoppingSessionId = 1;
      const error = new Error('Update failed');
      mockPrismaService.cartItem.update.mockRejectedValue(error);

      await expect(repository.update(id, updateCartItemResponse, shoppingSessionId)).rejects.toThrow('Update failed');
    });
  });

  describe('remove', () => {
    it('should remove a cart item with correct id and shopping session id', async () => {
      const id = 1;
      const shoppingSessionId = 1;
      mockPrismaService.cartItem.delete.mockResolvedValue(mockCartItem);

      const result = await repository.remove(id, shoppingSessionId);

      expect(prismaService.cartItem.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
          shopping_session_id: 1,
        },
      });
      expect(result).toEqual(mockCartItem);
    });

    it('should throw an error if removal fails', async () => {
      const id = 1;
      const shoppingSessionId = 1;
      const error = new Error('Removal failed');
      mockPrismaService.cartItem.delete.mockRejectedValue(error);

      await expect(repository.remove(id, shoppingSessionId)).rejects.toThrow('Removal failed');
    });
  });
});
