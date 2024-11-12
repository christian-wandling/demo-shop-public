import { validate } from 'class-validator';
import { OrderItemDTO, toOrderItemDTO } from './order-item-dto';
import { OrderItem } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('OrderItemDTO', () => {
  let dto: OrderItemDTO;

  beforeEach(() => {
    dto = {
      productId: 'prod123',
      productName: 'Test Product',
      productThumbnail: 'https://example.com/image.jpg',
      quantity: 2,
      unitPrice: 19.99,
      totalPrice: 39.98,
    };
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      const errors = await validate(Object.assign(new OrderItemDTO(), dto));
      expect(errors).toHaveLength(0);
    });

    describe('productId', () => {
      it('should fail validation when empty', async () => {
        dto.productId = '';
        const errors = await validate(Object.assign(new OrderItemDTO(), dto));
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('productName', () => {
      it('should fail validation when empty', async () => {
        dto.productName = '';
        const errors = await validate(Object.assign(new OrderItemDTO(), dto));
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('productThumbnail', () => {
      it('should fail validation with invalid URL', async () => {
        dto.productThumbnail = 'invalid-url';
        const errors = await validate(Object.assign(new OrderItemDTO(), dto));
        expect(errors[0].constraints).toHaveProperty('isUrl');
      });
    });

    describe('quantity', () => {
      it('should fail validation when quantity is 0', async () => {
        dto.quantity = 0;
        const errors = await validate(Object.assign(new OrderItemDTO(), dto));
        expect(errors[0].constraints).toHaveProperty('min');
      });

      it('should fail validation when quantity is not an integer', async () => {
        dto.quantity = 1.5;
        const errors = await validate(Object.assign(new OrderItemDTO(), dto));
        expect(errors[0].constraints).toHaveProperty('isInt');
      });
    });

    describe('unitPrice', () => {
      it('should fail validation when price is 0', async () => {
        dto.unitPrice = 0;
        const errors = await validate(Object.assign(new OrderItemDTO(), dto));
        expect(errors[0].constraints).toHaveProperty('min');
      });

      it('should fail validation when price has more than 2 decimal places', async () => {
        dto.unitPrice = 19.999;
        const errors = await validate(Object.assign(new OrderItemDTO(), dto));
        expect(errors[0].constraints).toHaveProperty('isNumber');
      });
    });

    describe('totalPrice', () => {
      it('should fail validation when total price is 0', async () => {
        dto.totalPrice = 0;
        const errors = await validate(Object.assign(new OrderItemDTO(), dto));
        expect(errors[0].constraints).toHaveProperty('min');
      });

      it('should fail validation when total price has more than 2 decimal places', async () => {
        dto.totalPrice = 39.999;
        const errors = await validate(Object.assign(new OrderItemDTO(), dto));
        expect(errors[0].constraints).toHaveProperty('isNumber');
      });
    });
  });
});

describe('toOrderItemDTO', () => {
  it('should correctly transform OrderItem to OrderItemDTO', () => {
    const orderItem: OrderItem = {
      id: 1,
      orderId: 1,
      productId: 123,
      productName: 'Test Product',
      productThumbnail: 'https://example.com/image.jpg',
      quantity: 2,
      price: new Decimal('19.99'),
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
      deletedAt: null,
    };

    const result = toOrderItemDTO(orderItem);

    expect(result).toEqual({
      productId: '123',
      productName: 'Test Product',
      productThumbnail: 'https://example.com/image.jpg',
      quantity: 2,
      unitPrice: 19.99,
      totalPrice: 39.98,
    });
  });

  it('should correctly calculate total price', () => {
    const orderItem: OrderItem = {
      id: 1,
      orderId: 1,
      productId: 123,
      productName: 'Test Product',
      productThumbnail: 'https://example.com/image.jpg',
      quantity: 3,
      price: new Decimal('10.50'),
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
      deletedAt: null,
    };

    const result = toOrderItemDTO(orderItem);
    expect(result.totalPrice).toBe(31.5);
  });

  it('should handle zero quantity correctly', () => {
    const orderItem: OrderItem = {
      id: 1,
      orderId: 1,
      productId: 123,
      productName: 'Test Product',
      productThumbnail: 'https://example.com/image.jpg',
      quantity: 0,
      price: new Decimal('10.50'),
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
      deletedAt: null,
    };

    const result = toOrderItemDTO(orderItem);
    expect(result.totalPrice).toBe(0);
  });
});
