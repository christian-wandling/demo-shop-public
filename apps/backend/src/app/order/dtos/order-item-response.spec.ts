import { toOrderItemResponse } from './order-item-response';
import { OrderItem } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('toOrderItemResponse', () => {
  it('should correctly transform OrderItem to OrderItemResponse', () => {
    const orderItem: OrderItem = {
      id: 1,
      order_id: 1,
      product_id: 123,
      product_name: 'Test Product',
      product_thumbnail: 'https://example.com/image.jpg',
      quantity: 2,
      price: new Decimal('19.99'),
      created_at: new Date(),
      updated_at: new Date(),
      deleted: false,
      deleted_at: null,
    };

    const result = toOrderItemResponse(orderItem);

    expect(result).toEqual({
      productId: 123,
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
      order_id: 1,
      product_id: 123,
      product_name: 'Test Product',
      product_thumbnail: 'https://example.com/image.jpg',
      quantity: 3,
      price: new Decimal('10.50'),
      created_at: new Date(),
      updated_at: new Date(),
      deleted: false,
      deleted_at: null,
    };

    const result = toOrderItemResponse(orderItem);
    expect(result.totalPrice).toBe(31.5);
  });

  it('should handle zero quantity correctly', () => {
    const orderItem: OrderItem = {
      id: 1,
      order_id: 1,
      product_id: 123,
      product_name: 'Test Product',
      product_thumbnail: 'https://example.com/image.jpg',
      quantity: 0,
      price: new Decimal('10.50'),
      created_at: new Date(),
      updated_at: new Date(),
      deleted: false,
      deleted_at: null,
    };

    const result = toOrderItemResponse(orderItem);
    expect(result.totalPrice).toBe(0);
  });
});
