import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemsRepository } from './cart-items.repository';
import { CartItemDTO, CreateCartItemDTO, UpdateCartItemDTO } from '../dtos/cart-item-dto';
import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { Decimal } from '@prisma/client/runtime/library';

describe('CartItemsService', () => {
  let service: CartItemsService;
  let repository: CartItemsRepository;

  const mockHydratedCartItem: HydratedCartItem = {
    id: 123,
    productId: 456,
    quantity: 1,
    shoppingSessionId: 1,
    createdAt: undefined,
    updatedAt: undefined,
    product: {
      id: 1,
      name: 'Test Product',
      description: 'description',
      price: new Decimal(19.99),
      deleted: false,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      images: [
        {
          uri: 'https://example.com/image.jpg',
          id: 0,
          name: '',
          productId: 0,
          deleted: false,
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
        },
      ],
    },
  };

  const mockCartItemDto: CartItemDTO = {
    id: '123',
    productId: '456',
    quantity: 1,
    productName: 'Test Product',
    productThumbnail: 'https://example.com/image.jpg',
    unitPrice: 19.99,
    totalPrice: 19.99,
  };

  const mockRepository = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemsService,
        {
          provide: CartItemsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CartItemsService>(CartItemsService);
    repository = module.get<CartItemsRepository>(CartItemsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto: CreateCartItemDTO = {
      productId: '123',
    };
    const sessionId = 'session-1';

    it('should create a cart item successfully', async () => {
      mockRepository.create.mockResolvedValue(mockHydratedCartItem);

      const result = await service.create(createDto, sessionId);

      expect(repository.create).toHaveBeenCalledWith(createDto, sessionId);
      expect(result).toEqual(mockCartItemDto);
    });

    it('should throw InternalServerErrorException when repository returns null', async () => {
      mockRepository.create.mockResolvedValue(null);

      await expect(service.create(createDto, sessionId)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateCartItemDTO = {
      quantity: 3,
    };
    const itemId = '1';
    const sessionId = 'session-1';

    it('should update a cart item successfully', async () => {
      const updatedCartItem = { ...mockHydratedCartItem, quantity: 3 };
      const updatedCartItemDto = { ...mockCartItemDto, quantity: 3, totalPrice: 59.97 };
      mockRepository.update.mockResolvedValue(updatedCartItem);

      const result = await service.update(itemId, updateDto, sessionId);

      expect(repository.update).toHaveBeenCalledWith(itemId, updateDto, sessionId);
      expect(result).toEqual(updatedCartItemDto);
    });

    it('should throw InternalServerErrorException when repository returns null', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update(itemId, updateDto, sessionId)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    const itemId = '1';
    const sessionId = 'session-1';

    it('should remove a cart item successfully', async () => {
      mockRepository.remove.mockResolvedValue(mockHydratedCartItem);

      await service.remove(itemId, sessionId);

      expect(repository.remove).toHaveBeenCalledWith(itemId, sessionId);
    });

    it('should throw InternalServerErrorException when repository returns null', async () => {
      mockRepository.remove.mockResolvedValue(null);

      await expect(service.remove(itemId, sessionId)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
