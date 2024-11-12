import { validate } from 'class-validator';
import { CartItemDTO, UpdateCartItemDTO, CreateCartItemDTO, toCartItemDto } from './cart-item-dto';
import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { Decimal } from '@prisma/client/runtime/library';

describe('CartItemDTO', () => {
  let dto: CartItemDTO;

  beforeEach(() => {
    dto = new CartItemDTO();
    dto.id = '123';
    dto.productId = '456';
    dto.productName = 'Test Product';
    dto.productThumbnail = 'https://example.com/image.jpg';
    dto.quantity = 2;
    dto.unitPrice = 19.99;
    dto.totalPrice = 39.98;
  });

  it('should pass validation with valid data', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with empty id', async () => {
    dto.id = '';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('id');
  });

  it('should fail validation with empty productId', async () => {
    dto.productId = '';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('productId');
  });

  it('should fail validation with invalid productThumbnail URL', async () => {
    dto.productThumbnail = 'invalid-url';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('productThumbnail');
  });

  it('should fail validation with zero quantity', async () => {
    dto.quantity = 0;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('quantity');
  });

  it('should fail validation with negative quantity', async () => {
    dto.quantity = -1;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('quantity');
  });

  it('should fail validation with invalid unitPrice', async () => {
    dto.unitPrice = 0;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('unitPrice');
  });

  it('should fail validation with too many decimal places in unitPrice', async () => {
    dto.unitPrice = 19.999;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('unitPrice');
  });
});

describe('UpdateCartItemDTO', () => {
  let dto: UpdateCartItemDTO;

  beforeEach(() => {
    dto = new UpdateCartItemDTO();
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

describe('CreateCartItemDTO', () => {
  let dto: CreateCartItemDTO;

  beforeEach(() => {
    dto = new CreateCartItemDTO();
    dto.productId = '123';
  });

  it('should pass validation with valid productId', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with empty productId', async () => {
    dto.productId = '';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('toCartItemDto', () => {
  it('should correctly transform HydratedCartItem to CartItemDTO', () => {
    const mockHydratedItem: HydratedCartItem = {
      id: 123,
      productId: 456,
      quantity: 2,
      shoppingSessionId: 1,
      createdAt: undefined,
      updatedAt: undefined,
      product: {
        id: 1,
        name: 'Test Product',
        description: 'description',
        price: new Decimal(19.99),
        deleted: false,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
        images: [
          {
            uri: 'https://example.com/image.jpg',
            id: 0,
            name: '',
            productId: 0,
            deleted: false,
            createdAt: undefined,
            updatedAt: undefined,
            deletedAt: undefined,
          },
        ],
      },
    };

    const result = toCartItemDto(mockHydratedItem);

    expect(result).toEqual({
      id: '123',
      productId: '456',
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
      productId: 456,
      quantity: 2,
      shoppingSessionId: 1,
      createdAt: undefined,
      updatedAt: undefined,
      product: {
        id: 1,
        name: 'Test Product',
        description: 'description',
        price: new Decimal(19.99),
        deleted: false,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
        images: [],
      },
    };

    const result = toCartItemDto(mockHydratedItem);

    expect(result.productThumbnail).toBeUndefined();
  });

  it('should calculate total price correctly', () => {
    const mockHydratedItem: HydratedCartItem = {
      id: 123,
      productId: 456,
      quantity: 3,
      shoppingSessionId: 1,
      createdAt: undefined,
      updatedAt: undefined,
      product: {
        id: 1,
        name: 'Test Product',
        description: 'description',
        price: new Decimal(19.99),
        deleted: false,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
        images: [
          {
            uri: 'https://example.com/image.jpg',
            id: 0,
            name: '',
            productId: 0,
            deleted: false,
            createdAt: undefined,
            updatedAt: undefined,
            deletedAt: undefined,
          },
        ],
      },
    };

    const result = toCartItemDto(mockHydratedItem);

    expect(result.totalPrice).toBe(59.97);
  });
});
