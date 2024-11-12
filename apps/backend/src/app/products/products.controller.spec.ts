import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './services/products.service';
import { ProductDTO } from './dtos/product-dto';
import { RequestMethod } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: ProductsService;

  const mockProducts: ProductDTO[] = [
    {
      id: '1',
      name: 'Test Product',
      price: 19.99,
      description: 'description',
      categories: ['Category 1'],
      images: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            all: jest.fn().mockResolvedValue(mockProducts),
            find: jest.fn().mockResolvedValue(mockProducts[0]),
          },
        },
      ],
    }).compile();

    controller = module.get(ProductsController);
    productsService = module.get(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ProductController', () => {
    it('should have correct path', () => {
      const path = Reflect.getMetadata('path', ProductsController);
      expect(path).toBe('products');
    });

    it('should have correct version', () => {
      const version = Reflect.getMetadata('__version__', ProductsController);
      expect(version).toBe('1');
    });

    it('should be public', () => {
      const skipAuth = Reflect.getMetadata('skip-auth', ProductsController);
      const unprotected = Reflect.getMetadata('unprotected', ProductsController);
      expect(skipAuth).toBe(true);
      expect(unprotected).toBe(true);
    });
  });

  describe('getProduct', () => {
    it('should return a product by id', async () => {
      const id = '1';
      const result = await controller.getProduct(id);

      expect(result).toEqual(mockProducts[0]);
      expect(productsService.find).toHaveBeenCalledWith('1');
      expect(productsService.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if product is not found', async () => {
      const id = 'non-existent';
      jest.spyOn(productsService, 'find').mockRejectedValueOnce(new Error('Product not found'));

      await expect(controller.getProduct(id)).rejects.toThrow('Product not found');
      expect(productsService.find).toHaveBeenCalledWith(id);
      expect(productsService.find).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', ProductsController.prototype.getProduct);
      expect(path).toEqual(':id');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', ProductsController.prototype.getProduct);
      expect(method).toEqual(RequestMethod.GET);
    });
  });
});
