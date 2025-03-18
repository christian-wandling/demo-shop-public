import { ProductResponse, toProductResponse } from './product-response';
import { HydratedProduct } from '../entities/hydrated-product';
import { Decimal } from '@prisma/client/runtime/library';
import * as batchConvertUtil from '../../common/util/batch-convert';

jest.mock('../../common/util/batch-convert', () => {
  return {
    batchConvert: jest.fn().mockReturnValue([]),
  };
});

describe('ProductResponse', () => {
  describe('toProductResponse', () => {
    it('should convert HydratedProduct to ProductResponse', () => {
      const mockProduct: HydratedProduct = {
        id: 123,
        name: 'Test Product',
        description: 'Test Description',
        deleted: false,
        created_at: undefined,
        updated_at: undefined,
        deleted_at: undefined,
        categories: [
          {
            category_id: 1,
            product_id: 123,
            category: {
              id: 1,
              name: 'category1',
              deleted: false,
              created_at: undefined,
              updated_at: undefined,
              deleted_at: undefined,
            },
          },
          {
            category_id: 2,
            product_id: 123,
            category: {
              id: 2,
              name: 'category2',
              deleted: false,
              created_at: undefined,
              updated_at: undefined,
              deleted_at: undefined,
            },
          },
        ],
        images: [],
        price: new Decimal(29.99),
      };

      const expectedDto: ProductResponse = {
        id: 123,
        name: 'Test Product',
        description: 'Test Description',
        categories: ['category1', 'category2'],
        images: [],
        price: 29.99,
        thumbnail: undefined,
      };

      const result = toProductResponse(mockProduct);

      expect(result).toEqual(expectedDto);
      expect(batchConvertUtil.batchConvert).toHaveBeenCalledWith(mockProduct.images, expect.any(Function));
    });

    it('should convert string price to number', () => {
      const mockProduct: HydratedProduct = {
        id: 123,
        name: 'Test Product',
        description: 'Test Description',
        deleted: false,
        created_at: undefined,
        updated_at: undefined,
        deleted_at: undefined,
        categories: [],
        images: [],
        price: new Decimal(29.99),
      };

      const result = toProductResponse(mockProduct);

      expect(result.price).toBe(29.99);
      expect(typeof result.price).toBe('number');
    });
  });
});
