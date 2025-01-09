import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ShoppingSessionDTO, toShoppingSessionDTO } from './shopping-session-dto';
import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import * as batchConvertUtil from '../../common/util/batch-convert';

jest.mock('../../common/util/batch-convert', () => {
  return {
    batchConvert: jest.fn().mockReturnValue([]),
  };
});

describe('ShoppingSessionDTO', () => {
  describe('Validation', () => {
    it('should validate a valid DTO', async () => {
      const dto = plainToInstance(ShoppingSessionDTO, {
        id: 1,
        userId: 1,
        items: [],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty id', async () => {
      const dto = plainToInstance(ShoppingSessionDTO, {
        id: undefined,
        userId: 1,
        items: [],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation with empty userId', async () => {
      const dto = plainToInstance(ShoppingSessionDTO, {
        id: 1,
        userId: undefined,
        items: [],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('userId');
    });

    it('should validate nested cart items', async () => {
      const dto = plainToInstance(ShoppingSessionDTO, {
        id: 1,
        userId: 1,
        items: [
          {
            id: undefined, // Invalid empty id
            productId: 1,
            quantity: 1,
            price: 10.99,
          },
        ],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('items');
    });
  });

  describe('toShoppingSessionDTO', () => {
    const mockSession: HydratedShoppingSession = {
      createdAt: undefined,
      updatedAt: undefined,
      id: 1,
      userId: 1,
      cartItems: [],
    };

    it('should convert HydratedShoppingSession to DTO', () => {
      const result = toShoppingSessionDTO(mockSession);

      expect(result).toEqual({
        id: 1,
        userId: 1,
        items: [],
      });
    });

    it('should call batchConvert with correct parameters', () => {
      toShoppingSessionDTO(mockSession);

      expect(batchConvertUtil.batchConvert).toHaveBeenCalledWith(mockSession.cartItems, expect.any(Function));
    });
  });
});
