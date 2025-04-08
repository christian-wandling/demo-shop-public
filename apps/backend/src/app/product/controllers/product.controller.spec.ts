import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../services/product.service';
import { ProductResponse } from '../dtos/product-response';
import { RequestMethod } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  const mockProducts: ProductResponse[] = [
    {
      id: 1,
      name: 'Test Product',
      price: 19.99,
      description: 'description',
      categories: ['Category 1'],
      images: [],
      thumbnail: undefined,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            all: jest.fn().mockResolvedValue(mockProducts),
            find: jest.fn().mockResolvedValue(mockProducts[0]),
          },
        },
      ],
    }).compile();

    controller = module.get(ProductController);
    productService = module.get(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ProductController', () => {
    it('should have correct path', () => {
      const path = Reflect.getMetadata('path', ProductController);
      expect(path).toBe('products');
    });

    it('should have correct version', () => {
      const version = Reflect.getMetadata('__version__', ProductController);
      expect(version).toBe('1');
    });

    it('should be public', () => {
      const skipAuth = Reflect.getMetadata('skip-auth', ProductController);
      const unprotected = Reflect.getMetadata('unprotected', ProductController);
      expect(skipAuth).toBe(true);
      expect(unprotected).toBe(true);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const result = await controller.getAllProducts();

      expect(result).toEqual(mockProducts);
      expect(productService.all).toHaveBeenCalled();
      expect(productService.all).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', ProductController.prototype.getAllProducts);
      expect(path).toEqual('/');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', ProductController.prototype.getAllProducts);
      expect(method).toEqual(RequestMethod.GET);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const id = 1;
      const result = await controller.getProductById(id);

      expect(result).toEqual(mockProducts[0]);
      expect(productService.find).toHaveBeenCalledWith(1);
      expect(productService.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if product is not found', async () => {
      const id = undefined;
      jest.spyOn(productService, 'find').mockRejectedValueOnce(new Error('Product not found'));

      await expect(controller.getProductById(id)).rejects.toThrow('Product not found');
      expect(productService.find).toHaveBeenCalledTimes(1);
    });

    it('should have the correct path', () => {
      const path = Reflect.getMetadata('path', ProductController.prototype.getProductById);
      expect(path).toEqual(':id');
    });

    it('should have the correct method', () => {
      const method = Reflect.getMetadata('method', ProductController.prototype.getProductById);
      expect(method).toEqual(RequestMethod.GET);
    });
  });
});
