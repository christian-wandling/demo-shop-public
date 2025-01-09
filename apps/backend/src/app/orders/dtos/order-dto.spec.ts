import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { OrderDTO, toOrderDto } from './order-dto';
import { HydratedOrder } from '../entities/hydrated-order';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderStatus } from '@prisma/client';

describe('OrderDTO', () => {
  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      const orderData: OrderDTO = {
        id: 123,
        userId: 456,
        items: [
          {
            productId: 101,
            quantity: 2,
            unitPrice: 29.99,
            productName: 'productName',
            productThumbnail: 'http://url.url',
            totalPrice: 59.98,
          },
        ],
        amount: 59.98,
        status: OrderStatus.CREATED,
        created: new Date(),
      };

      const orderDto = plainToInstance(OrderDTO, orderData);
      const errors = await validate(orderDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty items array', async () => {
      const orderData: OrderDTO = {
        id: 123,
        userId: 456,
        items: [], // Invalid: array must have at least one item
        amount: 100,
        status: OrderStatus.CREATED,
        created: new Date(),
      };

      const orderDto = plainToInstance(OrderDTO, orderData);
      const errors = await validate(orderDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('items');
      expect(errors[0].constraints).toHaveProperty('arrayMinSize');
    });

    it('should fail validation with missing items array', async () => {
      const orderData = {
        id: 123,
        userId: 456,
        amount: 100,
        status: OrderStatus.CREATED,
        created: new Date(),
      };

      const orderDto = plainToInstance(OrderDTO, orderData);
      const errors = await validate(orderDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('items');
    });

    it('should fail validation with empty id', async () => {
      const orderData = {
        id: undefined, // Invalid
        userId: 456,
        items: [
          {
            productId: 101,
            quantity: 2,
            unitPrice: 29.99,
            productName: 'productName',
            productThumbnail: 'http://url.url',
            totalPrice: 59.98,
          },
        ],
        amount: 100,
        status: OrderStatus.CREATED,
        created: new Date(),
      };

      const orderDto = plainToInstance(OrderDTO, orderData);
      const errors = await validate(orderDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation with invalid amount', async () => {
      const orderData = {
        id: 123,
        userId: 456,
        items: [
          {
            productId: 101,
            quantity: 2,
            unitPrice: 29.99,
            productName: 'productName',
            productThumbnail: 'http://url.url',
            totalPrice: 59.98,
          },
        ],
        amount: 0, // Invalid
        status: OrderStatus.CREATED,
        created: new Date(),
      };

      const orderDto = plainToInstance(OrderDTO, orderData);
      const errors = await validate(orderDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('amount');
    });

    it('should fail validation with invalid status', async () => {
      const orderData = {
        id: 123,
        userId: 456,
        items: [
          {
            productId: 101,
            quantity: 2,
            unitPrice: 29.99,
            productName: 'productName',
            productThumbnail: 'http://url.url',
            totalPrice: 59.98,
          },
        ],
        amount: 100,
        status: 'INVALID_STATUS', // Invalid
        created: new Date(),
      };

      const orderDto = plainToInstance(OrderDTO, orderData);
      const errors = await validate(orderDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('status');
    });
  });

  describe('toOrderDto', () => {
    it('should correctly convert HydratedOrder to OrderDTO', () => {
      const createdAt = new Date();
      const mockHydratedOrder: HydratedOrder = {
        id: 123,
        userId: 456,
        items: [
          {
            id: 789,
            productId: 101,
            quantity: 2,
            price: new Decimal('29.99'),
            orderId: 0,
            productName: '',
            productThumbnail: '',
            deleted: false,
            createdAt: undefined,
            updatedAt: undefined,
            deletedAt: undefined,
          },
        ],
        status: OrderStatus.CREATED,
        createdAt,
        deleted: false,
        updatedAt: undefined,
        deletedAt: undefined,
      };

      const result = toOrderDto(mockHydratedOrder);

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
        status: OrderStatus.CREATED,
        created: createdAt,
      });
    });

    it('should calculate correct amount for multiple items', () => {
      const mockHydratedOrder: HydratedOrder = {
        id: 123,
        userId: 456,
        items: [
          {
            id: 789,
            productId: 101,
            quantity: 2,
            price: new Decimal('29.99'),
            orderId: 0,
            productName: '',
            productThumbnail: '',
            deleted: false,
            createdAt: undefined,
            updatedAt: undefined,
            deletedAt: undefined,
          },
          {
            id: 790,
            productId: 102,
            quantity: 1,
            price: new Decimal('49.99'),
            orderId: 0,
            productName: '',
            productThumbnail: '',
            deleted: false,
            createdAt: undefined,
            updatedAt: undefined,
            deletedAt: undefined,
          },
        ],
        status: OrderStatus.CREATED,
        createdAt: new Date(),
        deleted: false,
        updatedAt: undefined,
        deletedAt: undefined,
      };

      const result = toOrderDto(mockHydratedOrder);

      // 2 * 29.99 + 1 * 49.99 = 109.97
      expect(result.amount).toBe(109.97);
    });
  });
});
