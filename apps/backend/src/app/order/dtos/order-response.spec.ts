import { toOrderResponse } from './order-response';
import { HydratedOrder } from '../entities/hydrated-order';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderStatus } from '@prisma/client';

describe('toOrderResponse', () => {
  it('should correctly convert HydratedOrder to OrderResponse', () => {
    const created_at = new Date();
    const mockHydratedOrder: HydratedOrder = {
      id: 123,
      user_id: 456,
      order_items: [
        {
          id: 789,
          product_id: 101,
          quantity: 2,
          price: new Decimal('29.99'),
          order_id: 0,
          product_name: '',
          product_thumbnail: '',
          deleted: false,
          created_at: undefined,
          updated_at: undefined,
          deleted_at: undefined,
        },
      ],
      status: OrderStatus.Created,
      created_at,
      deleted: false,
      updated_at: undefined,
      deleted_at: undefined,
    };

    const result = toOrderResponse(mockHydratedOrder);

    expect(result).toEqual({
      id: 123,
      userId: 456,
      items: [
        {
          productId: 101,
          quantity: 2,
          unitPrice: 29.99,
          productName: '',
          productThumbnail: '',
          totalPrice: 59.98,
        },
      ],
      amount: 59.98, // 2 * 29.99
      status: OrderStatus.Created,
      created: created_at,
    });
  });

  it('should calculate correct amount for multiple items', () => {
    const mockHydratedOrder: HydratedOrder = {
      id: 123,
      user_id: 456,
      order_items: [
        {
          id: 789,
          product_id: 101,
          quantity: 2,
          price: new Decimal('29.99'),
          order_id: 0,
          product_name: '',
          product_thumbnail: '',
          deleted: false,
          created_at: undefined,
          updated_at: undefined,
          deleted_at: undefined,
        },
        {
          id: 790,
          product_id: 102,
          quantity: 1,
          price: new Decimal('49.99'),
          order_id: 0,
          product_name: '',
          product_thumbnail: '',
          deleted: false,
          created_at: undefined,
          updated_at: undefined,
          deleted_at: undefined,
        },
      ],
      status: OrderStatus.Created,
      created_at: new Date(),
      deleted: false,
      updated_at: undefined,
      deleted_at: undefined,
    };

    const result = toOrderResponse(mockHydratedOrder);

    // 2 * 29.99 + 1 * 49.99 = 109.97
    expect(result.amount).toBe(109.97);
  });
});
