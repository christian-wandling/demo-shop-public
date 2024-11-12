import { batchConvert } from './batch-convert';

describe('batchConvert', () => {
  it('should handle transformations', () => {
    interface Order {
      id: string;
      amount: number;
    }

    interface ProcessedOrder {
      orderId: string;
      total: number;
      tax: number;
    }

    const orders: Order[] = [
      { id: 'A1', amount: 100 },
      { id: 'A2', amount: 200 },
    ];

    const processOrder = (order: Order): ProcessedOrder => ({
      orderId: order.id,
      total: order.amount,
      tax: order.amount * 0.1,
    });

    const result = batchConvert<ProcessedOrder, Order>(orders, processOrder);

    expect(result).toEqual([
      { orderId: 'A1', total: 100, tax: 10 },
      { orderId: 'A2', total: 200, tax: 20 },
    ]);
  });

  it('should propagate errors from transformation function', () => {
    const numbers = [1, 0];
    const divide10 = (n: number) => {
      if (n === 0) throw new Error('Division by zero');
      return 1 / n;
    };

    expect(() => batchConvert(numbers, divide10)).toThrow('Division by zero');
  });
});
