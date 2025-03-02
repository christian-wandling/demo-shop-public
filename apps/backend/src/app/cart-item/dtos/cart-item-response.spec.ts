import { validate } from 'class-validator';
import { toCartItemResponse } from './cart-item-response';
import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { Decimal } from '@prisma/client/runtime/library';
import { UpdateCartItemQuantityRequest } from './update-cart-item-quantity-request';
import { AddCartItemRequest } from './add-cart-item-request';

describe('UpdateCartItemResponse', () => {
  let dto: UpdateCartItemQuantityRequest;

  beforeEach(() => {
    dto = new UpdateCartItemQuantityRequest();
    dto.quantity = 2;
  });

  it('should pass validation with valid quantity', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with zero quantity', async () => {
    dto.quantity = 0;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with negative quantity', async () => {
    dto.quantity = -1;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with decimal quantity', async () => {
    dto.quantity = 1.5;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('CreateCartItemResponse', () => {
  let dto: AddCartItemRequest;

  beforeEach(() => {
    dto = new AddCartItemRequest();
    dto.productId = 123;
  });

  it('should pass validation with valid productId', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with empty productId', async () => {
    dto.productId = undefined;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('toCartItemDto', () => {
  it('should correctly transform HydratedCartItem to CartItemResponse', () => {
    const mockHydratedItem: HydratedCartItem = {
      id: 123,
      product_id: 456,
      quantity: 2,
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

    const result = toCartItemResponse(mockHydratedItem);

    expect(result).toEqual({
      id: 123,
      productId: 456,
      productName: 'Test Product',
      productThumbnail: 'https://example.com/image.jpg',
      quantity: 2,
      unitPrice: 19.99,
      totalPrice: 39.98,
    });
  });

  it('should handle missing product images', () => {
    const mockHydratedItem: HydratedCartItem = {
      id: 123,
      product_id: 456,
      quantity: 2,
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
        images: [],
      },
    };

    const result = toCartItemResponse(mockHydratedItem);

    expect(result.productThumbnail).toBeUndefined();
  });

  it('should calculate total price correctly', () => {
    const mockHydratedItem: HydratedCartItem = {
      id: 123,
      product_id: 456,
      quantity: 3,
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

    const result = toCartItemResponse(mockHydratedItem);

    expect(result.totalPrice).toBe(59.97);
  });
});
