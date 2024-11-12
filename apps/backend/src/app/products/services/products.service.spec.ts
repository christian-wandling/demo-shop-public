import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { NotFoundException } from '@nestjs/common';
import { ProductDTO } from '../dtos/product-dto';
import { HydratedProduct } from '../entities/hydrated-product';
import { Decimal } from '@prisma/client/runtime/library';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: jest.Mocked<ProductsRepository>;

  const mockProduct: HydratedProduct = {
    id: 1,
    price: new Decimal(19.99),
    description: 'description',
    name: 'Test Product',
    deleted: false,
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
    categories: [
      {
        id: 1,
        name: 'Category 1',
        deleted: false,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
      },
    ],
    images: [],
  };

  const mockProductDTO: ProductDTO = {
    id: '1',
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
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get(ProductsRepository);
  });

  describe('all', () => {
    it('should return an array of product DTOs', async () => {
      repository.all.mockResolvedValue([mockProduct]);

      const result = await service.all();

      expect(result).toEqual([mockProductDTO]);
      expect(repository.all).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no products exist', async () => {
      repository.all.mockResolvedValue([]);

      const result = await service.all();

      expect(result).toEqual([]);
      expect(repository.all).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('should return a product DTO when product exists', async () => {
      repository.find.mockResolvedValue(mockProduct);

      const result = await service.find('1');

      expect(result).toEqual(mockProductDTO);
      expect(repository.find).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when product does not exist', async () => {
      repository.find.mockResolvedValue(null);

      await expect(service.find('1')).rejects.toThrow(NotFoundException);
      expect(repository.find).toHaveBeenCalledWith('1');
    });
  });
});
