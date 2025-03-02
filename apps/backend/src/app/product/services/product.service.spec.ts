import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { NotFoundException } from '@nestjs/common';
import { ProductResponse } from '../dtos/product-response';
import { HydratedProduct } from '../entities/hydrated-product';
import { Decimal } from '@prisma/client/runtime/library';

describe('ProductsService', () => {
  let service: ProductService;
  let repository: jest.Mocked<ProductRepository>;

  const mockProduct: HydratedProduct = {
    id: 1,
    price: new Decimal(19.99),
    description: 'description',
    name: 'Test Product',
    deleted: false,
    created_at: undefined,
    updated_at: undefined,
    deleted_at: undefined,
    categories: [
      {
        category_id: 1,
        category: {
          id: 1,
          name: 'Category 1',
          deleted: false,
          created_at: undefined,
          updated_at: undefined,
          deleted_at: undefined,
        },
        product_id: 1,
      },
    ],
    images: [],
  };

  const mockProductResponse: ProductResponse = {
    id: 1,
    name: 'Test Product',
    price: 19.99,
    description: 'description',
    categories: ['Category 1'],
    images: [],
  };

  beforeEach(async () => {
    const mockRepository = {
      all: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get(ProductRepository);
  });

  describe('all', () => {
    it('should return an array of product Responses', async () => {
      repository.all.mockResolvedValue([mockProduct]);

      const result = await service.all();

      expect(result).toEqual({ items: [mockProductResponse] });
      expect(repository.all).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no products exist', async () => {
      repository.all.mockResolvedValue([]);

      const result = await service.all();

      expect(result).toEqual({ items: [] });
      expect(repository.all).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('should return a product Response when product exists', async () => {
      repository.find.mockResolvedValue(mockProduct);

      const result = await service.find(1);

      expect(result).toEqual(mockProductResponse);
      expect(repository.find).toHaveBeenCalledWith(1);
    });

    it('should throw the right exception when product does not exist', async () => {
      repository.find.mockResolvedValue(null);

      await expect(service.find(1)).rejects.toThrow(NotFoundException);
      expect(repository.find).toHaveBeenCalledWith(1);
    });
  });
});
