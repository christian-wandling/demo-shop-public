import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemRepository } from './cart-item.repository';
import { CartItemResponse } from '../dtos/cart-item-response';
import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { Decimal } from '@prisma/client/runtime/library';
import { UpdateCartItemQuantityRequest } from '../dtos/update-cart-item-quantity-request';
import { AddCartItemRequest } from '../dtos/add-cart-item-request';

describe('CartItemsService', () => {
  let service: CartItemService;
  let repository: CartItemRepository;

  const mockHydratedCartItem: HydratedCartItem = {
    id: 123,
    product_id: 456,
    quantity: 1,
    shopping_session_id: 1,
    created_at: undefined,
    updated_at: undefined,
    product: {
      id: 1,
      name: 'Test Product',
      description: 'description',
      price: new Decimal(19.99),
      deleted: false,
      created_at: undefined,
      updated_at: undefined,
      deleted_at: undefined,
      images: [
        {
          uri: 'https://example.com/image.jpg',
          id: 0,
          name: '',
          product_id: 0,
          deleted: false,
          created_at: undefined,
          updated_at: undefined,
          deleted_at: undefined,
        },
      ],
    },
  };

  const mockCartItemDto: CartItemResponse = {
    id: 123,
    productId: 456,
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
        CartItemService,
        {
          provide: CartItemRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CartItemService>(CartItemService);
    repository = module.get<CartItemRepository>(CartItemRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto: AddCartItemRequest = {
      productId: 123,
    };
    const sessionId = 1;

    it('should create a cart item successfully', async () => {
      mockRepository.create.mockResolvedValue(mockHydratedCartItem);

      const result = await service.create(createDto, sessionId);

      expect(repository.create).toHaveBeenCalledWith(createDto, sessionId);
      expect(result).toEqual(mockCartItemDto);
    });

    it('should throw the right exception when repository returns null', async () => {
      mockRepository.create.mockResolvedValue(null);

      await expect(service.create(createDto, sessionId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateCartItemQuantityRequest = {
      quantity: 3,
    };
    const itemId = 1;
    const sessionId = 1;

    it('should update a cart item successfully', async () => {
      const updatedCartItem = { ...mockHydratedCartItem, quantity: 3 };
      const updatedCartItemDto = { ...mockCartItemDto, quantity: 3, totalPrice: 59.97 };
      mockRepository.update.mockResolvedValue(updatedCartItem);

      const result = await service.update(itemId, updateDto, sessionId);

      expect(repository.update).toHaveBeenCalledWith(itemId, updateDto, sessionId);
      expect(result).toEqual(updatedCartItemDto);
    });

    it('should throw the right exception when repository returns null', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update(itemId, updateDto, sessionId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    const itemId = 1;
    const sessionId = 1;

    it('should remove a cart item successfully', async () => {
      mockRepository.remove.mockResolvedValue(mockHydratedCartItem);

      await service.remove(itemId, sessionId);

      expect(repository.remove).toHaveBeenCalledWith(itemId, sessionId);
    });

    it('should throw the right exception when repository returns null', async () => {
      mockRepository.remove.mockResolvedValue(null);

      await expect(service.remove(itemId, sessionId)).rejects.toThrow(NotFoundException);
    });
  });
});
