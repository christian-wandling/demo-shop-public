import { Test } from '@nestjs/testing';
import { ProductsRepository } from './products.repository';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedProduct } from '../entities/hydrated-product';
import { Decimal } from '@prisma/client/runtime/library';

describe('ProductsRepository', () => {
  let repository: ProductsRepository;
  let prismaService: jest.Mocked<PrismaService>;

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
    images: [
      {
        id: 1,
        uri: 'image1.jpg',
        name: '',
        productId: 0,
        deleted: false,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
      },
    ],
  };

  beforeEach(async () => {
    const mockPrismaService = {
      product: {
        findMany: jest.fn(),
        findUniqueOrThrow: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = moduleRef.get<ProductsRepository>(ProductsRepository);
    prismaService = moduleRef.get(PrismaService) as jest.Mocked<PrismaService>;
  });

  describe('all', () => {
    it('should return all products with categories and images', async () => {
      const mockProducts = [mockProduct];
      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(mockProducts);

      const result = await repository.all();

      expect(result).toEqual(mockProducts);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        include: {
          categories: true,
          images: true,
        },
      });
    });

    it('should return empty array when no products exist', async () => {
      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue([]);

      const result = await repository.all();

      expect(result).toEqual([]);
      expect(prismaService.product.findMany).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('should find a product by id with categories and images', async () => {
      jest.spyOn(prismaService.product, 'findUniqueOrThrow').mockResolvedValue(mockProduct);

      const result = await repository.find('1');

      expect(result).toEqual(mockProduct);
      expect(prismaService.product.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          categories: true,
          images: true,
        },
      });
    });

    it('should throw error when product is not found', async () => {
      jest.spyOn(prismaService.product, 'findUniqueOrThrow').mockRejectedValue(new Error('Product not found'));

      await expect(repository.find('999')).rejects.toThrow('Product not found');
      expect(prismaService.product.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 999 },
        include: {
          categories: true,
          images: true,
        },
      });
    });
  });
});
