import { toShoppingSessionResponse } from './shopping-session-response';
import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import * as batchConvertUtil from '../../common/util/batch-convert';

jest.mock('../../common/util/batch-convert', () => {
  return {
    batchConvert: jest.fn().mockReturnValue([]),
  };
});

describe('toShoppingSessionResponse', () => {
  const mockSession: HydratedShoppingSession = {
    created_at: undefined,
    updated_at: undefined,
    id: 1,
    user_id: 1,
    cart_items: [],
  };

  it('should convert HydratedShoppingSession to Response', () => {
    const result = toShoppingSessionResponse(mockSession);

    expect(result).toEqual({
      id: 1,
      userId: 1,
      items: [],
    });
  });

  it('should call batchConvert with correct parameters', () => {
    toShoppingSessionResponse(mockSession);

    expect(batchConvertUtil.batchConvert).toHaveBeenCalledWith(mockSession.cart_items, expect.any(Function));
  });
});
