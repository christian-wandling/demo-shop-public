import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ProductDTO, toProductDTO } from './product-dto';
import { HydratedProduct } from '../entities/hydrated-product';
import { Decimal } from '@prisma/client/runtime/library';
import * as batchConvertUtil from '../../common/util/batch-convert';

jest.mock('../../common/util/batch-convert', () => {
  return {
    batchConvert: jest.fn().mockReturnValue([]),
  };
});

describe('ProductDTO', () => {
  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      const productDto = plainToInstance(ProductDTO, {
        id: 123,
        name: 'Test Product',
        description: 'Test Description',
        categories: ['category1', 'category2'],
        images: [],
        price: 29.99,
      });

      const errors = await validate(productDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty id', async () => {
      const productDto = plainToInstance(ProductDTO, {
        id: undefined,
        name: 'Test Product',
        description: 'Test Description',
        categories: ['category1'],
        images: [],
        price: 29.99,
      });

      const errors = await validate(productDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation with invalid price', async () => {
      const productDto = plainToInstance(ProductDTO, {
        id: 123,
        name: 'Test Product',
        description: 'Test Description',
        categories: ['category1'],
        images: [],
        price: 0,
      });

      const errors = await validate(productDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('price');
    });

    it('should fail validation with empty categories array', async () => {
      const productDto = plainToInstance(ProductDTO, {
        id: 123,
        name: 'Test Product',
        description: 'Test Description',
        categories: [],
        images: [],
        price: 29.99,
      });

      const errors = await validate(productDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('categories');
    });
  });

  describe('toProductDTO', () => {
    it('should convert HydratedProduct to ProductDTO', () => {
      const mockProduct: HydratedProduct = {
        id: 123,
        name: 'Test Product',
        description: 'Test Description',
        deleted: false,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
        categories: [
          {
            id: 1,
            name: 'category1',
            deleted: false,
            createdAt: undefined,
            updatedAt: undefined,
            deletedAt: undefined,
          },
          {
            id: 2,
            name: 'category2',
            deleted: false,
            createdAt: undefined,
            updatedAt: undefined,
            deletedAt: undefined,
          },
        ],
        images: [],
        price: new Decimal(29.99),
      };

      const expectedDto: ProductDTO = {
        id: 123,
        name: 'Test Product',
        description: 'Test Description',
        categories: ['category1', 'category2'],
        images: [],
        price: 29.99,
      };

      const result = toProductDTO(mockProduct);

      expect(result).toEqual(expectedDto);
      expect(batchConvertUtil.batchConvert).toHaveBeenCalledWith(mockProduct.images, expect.any(Function));
    });

    it('should convert string price to number', () => {
      const mockProduct: HydratedProduct = {
        id: 123,
        name: 'Test Product',
        description: 'Test Description',
        deleted: false,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
        categories: [],
        images: [],
        price: new Decimal(29.99),
      };

      const result = toProductDTO(mockProduct);

      expect(result.price).toBe(29.99);
      expect(typeof result.price).toBe('number');
    });
  });
});
