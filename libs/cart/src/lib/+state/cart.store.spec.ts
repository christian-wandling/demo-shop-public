import { TestBed } from '@angular/core/testing';
import { CartStore } from './cart.store';
import { ShoppingSessionApi } from '@demo-shop/api';
import { of } from 'rxjs';

describe('CartStore', () => {
  let store: any;
  let mockShoppingSessionApi: ShoppingSessionApi;

  const mockCartItems = [
    { id: 1, productId: 1, quantity: 2, totalPrice: 20, price: 10 },
    { id: 2, productId: 2, quantity: 1, totalPrice: 15, price: 15 },
  ];

  const mockShoppingSession = {
    id: 'session1',
    items: mockCartItems,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartStore,
        {
          provide: ShoppingSessionApi,
          useValue: {
            resolveCurrentShoppingSession: jest.fn().mockReturnValue(of(mockShoppingSession)),
            addCartItem: jest.fn().mockReturnValue(of(mockCartItems[0])),
            removeCartItem: jest.fn().mockReturnValue(of({})),
            updateCartItemQuantity: jest.fn().mockReturnValue(of({})),
          },
        },
      ],
    });

    mockShoppingSessionApi = TestBed.inject(ShoppingSessionApi);
    store = TestBed.inject(CartStore);
  });

  describe('Initial State', () => {
    it('should have initial state', () => {
      expect(store.showCart()).toBe(false);
      expect(store.shoppingSessionId()).toBeNull();
      expect(store.entities()).toEqual([]);
    });
  });

  describe('Computed Values', () => {
    beforeEach(async () => {
      await store.loadShoppingSession();
    });

    it('should calculate total price correctly', () => {
      expect(store.totalPrice()).toBe(35); // 20 + 15
    });

    it('should calculate item count correctly', () => {
      expect(store.itemCount()).toBe(3); // 2 + 1
    });

    it('should determine if shopping session exists', () => {
      expect(store.hasShoppingSession()).toBe(true);
    });
  });

  describe('loadShoppingSession', () => {
    it('should load shopping session and update state', async () => {
      await store.loadShoppingSession();

      expect(store.shoppingSessionId()).toBe('session1');
      expect(store.entities()).toEqual(mockCartItems);
      expect(mockShoppingSessionApi.resolveCurrentShoppingSession).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should throw error if no shopping session exists', async () => {
      const createDto = { productId: 'p3', quantity: 1 };

      await expect(store.create(createDto)).rejects.toThrow('Missing shopping session id');
    });

    it('should create cart item and reload session', async () => {
      await store.loadShoppingSession();
      const createDto = { productId: 'p3', quantity: 1 };

      await store.create(createDto);

      expect(mockShoppingSessionApi.addCartItem).toHaveBeenCalledWith(createDto);
      expect(mockShoppingSessionApi.resolveCurrentShoppingSession).toHaveBeenCalledTimes(2);
    });
  });

  describe('delete', () => {
    it('should throw error if no shopping session exists', async () => {
      await expect(store.delete(1)).rejects.toThrow('Missing shopping session id');
    });

    it('should delete cart item and reload session', async () => {
      await store.loadShoppingSession();

      await store.delete(1);

      expect(mockShoppingSessionApi.removeCartItem).toHaveBeenCalledWith(1);
      expect(mockShoppingSessionApi.resolveCurrentShoppingSession).toHaveBeenCalledTimes(2);
    });
  });

  describe('update', () => {
    it('should throw error if no shopping session exists', async () => {
      const updateDto = { quantity: 2 };
      await expect(store.update(1, updateDto)).rejects.toThrow('Missing shopping session id');
    });

    it('should update cart item and reload session', async () => {
      await store.loadShoppingSession();
      const updateDto = { quantity: 2 };

      await store.update(1, updateDto);

      expect(mockShoppingSessionApi.updateCartItemQuantity).toHaveBeenCalledWith(1, updateDto);
      expect(mockShoppingSessionApi.resolveCurrentShoppingSession).toHaveBeenCalledTimes(2);
    });
  });

  describe('getItemById', () => {
    beforeEach(async () => {
      await store.loadShoppingSession();
    });

    it('should return item by id if exists', () => {
      const item = store.getItemById(1);
      expect(item).toEqual(mockCartItems[0]);
    });

    it('should return undefined if item does not exist', () => {
      const item = store.getItemById('nonexistent');
      expect(item).toBeUndefined();
    });
  });

  describe('getItemByProductId', () => {
    beforeEach(async () => {
      await store.loadShoppingSession();
    });

    it('should return item by product id if exists', () => {
      const item = store.getItemByProductId(1);
      expect(item).toEqual(mockCartItems[0]);
    });

    it('should return undefined if item does not exist', () => {
      const item = store.getItemByProductId('nonexistent');
      expect(item).toBeUndefined();
    });
  });

  describe('setShowCart', () => {
    it('should update showCart state', () => {
      store.setShowCart(true);
      expect(store.showCart()).toBe(true);

      store.setShowCart(false);
      expect(store.showCart()).toBe(false);
    });
  });
});
