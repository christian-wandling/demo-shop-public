import { Test } from '@nestjs/testing';
import { ProductRepository } from './product.repository';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedProduct } from '../entities/hydrated-product';
import { Decimal } from '@prisma/client/runtime/library';

describe('ProductsRepository', () => {
  let repository: ProductRepository;
  let prismaService: jest.Mocked<PrismaService>;

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
    images: [
      {
        id: 1,
        uri: 'image1.jpg',
        name: '',
        product_id: 0,
        deleted: false,
        created_at: undefined,
        updated_at: undefined,
        deleted_at: undefined,
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
        ProductRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = moduleRef.get<ProductRepository>(ProductRepository);
    prismaService = moduleRef.get(PrismaService) as jest.Mocked<PrismaService>;
  });

  describe('all', () => {
    it('should return all products with categories and images', async () => {
      const mockProducts = [mockProduct];
      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(mockProducts);

      const result = await repository.all();

      expect(result).toEqual(mockProducts);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: { deleted: false },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          images: {
            where: {
              deleted: false,
            },
          },
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

      const result = await repository.find(1);

      expect(result).toEqual(mockProduct);
      expect(prismaService.product.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1, deleted: false },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          images: {
            where: {
              deleted: false,
            },
          },
        },
      });
    });

    it('should throw error when product is not found', async () => {
      jest.spyOn(prismaService.product, 'findUniqueOrThrow').mockRejectedValue(new Error('Product not found'));

      await expect(repository.find(999)).rejects.toThrow('Product not found');
      expect(prismaService.product.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 999, deleted: false },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          images: {
            where: {
              deleted: false,
            },
          },
        },
      });
    });
  });
});
