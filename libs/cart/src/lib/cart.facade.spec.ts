import { TestBed } from '@angular/core/testing';
import { CartFacade } from './cart.facade';
import { CartStore } from './+state/cart.store';
import { CartItemResponse } from '@demo-shop/api';
import { signal } from '@angular/core';

describe('CartFacade', () => {
  let facade: CartFacade;
  let cartStore: any;

  const mockCartItems: CartItemResponse[] = [
    {
      id: 1,
      productId: 1,
      quantity: 2,
      productName: '',
      productThumbnail: '',
      unitPrice: 0,
      totalPrice: 0,
    },
    {
      id: 2,
      productId: 2,
      quantity: 1,
      productName: '',
      productThumbnail: '',
      unitPrice: 0,
      totalPrice: 0,
    },
  ];

  beforeEach(() => {
    cartStore = {
      entities: signal(mockCartItems),
      totalPrice: signal(100),
      itemCount: signal(3),
      showCart: signal(false),
      hasShoppingSession: signal(true),
      getItemByProductId: jest.fn(),
      getItemById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      setShowCart: jest.fn(),
      loadShoppingSession: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [CartFacade, { provide: CartStore, useValue: cartStore }],
    });

    facade = TestBed.inject(CartFacade);
  });

  describe('getAll', () => {
    it('should return all cart items', () => {
      expect(facade.getAll()()).toEqual(mockCartItems);
    });
  });

  describe('getTotalPrice', () => {
    it('should return total price', () => {
      expect(facade.getTotalPrice()()).toBe(100);
    });
  });

  describe('getItemCount', () => {
    it('should return item count', () => {
      expect(facade.getItemCount()()).toBe(3);
    });
  });

  describe('addItem', () => {
    it('should update quantity when item exists', () => {
      const existingItem = { id: 1, productId: 1, quantity: 2 };
      cartStore.getItemByProductId.mockReturnValue(existingItem);

      facade.addItem(1);

      expect(cartStore.update).toHaveBeenCalledWith(1, { quantity: 3 });
      expect(cartStore.create).not.toHaveBeenCalled();
    });

    it('should create new item when item does not exist', () => {
      cartStore.getItemByProductId.mockReturnValue(null);

      facade.addItem(3);

      expect(cartStore.create).toHaveBeenCalledWith({ productId: 3 });
      expect(cartStore.update).not.toHaveBeenCalled();
    });
  });

  describe('updateItem', () => {
    it('should update item quantity', () => {
      facade.updateItem(1, 5);

      expect(cartStore.update).toHaveBeenCalledWith(1, { quantity: 5 });
    });
  });

  describe('removeItem', () => {
    it('should decrease quantity when item quantity > 1', () => {
      const existingItem = { id: 1, productId: 1, quantity: 2 };
      cartStore.getItemById.mockReturnValue(existingItem);

      facade.removeItem(1);

      expect(cartStore.update).toHaveBeenCalledWith(1, { quantity: 1 });
      expect(cartStore.delete).not.toHaveBeenCalled();
    });

    it('should delete item when quantity is 1', () => {
      const existingItem = { id: 1, productId: 1, quantity: 1 };
      cartStore.getItemById.mockReturnValue(existingItem);

      facade.removeItem(1);

      expect(cartStore.delete).toHaveBeenCalledWith(1);
      expect(cartStore.update).not.toHaveBeenCalled();
    });
  });

  describe('getShowCart', () => {
    it('should return showCart value', () => {
      expect(facade.getShowCart()()).toBe(false);
    });
  });

  describe('getHasShoppingSession', () => {
    it('should return hasShoppingSession value', () => {
      expect(facade.getHasShoppingSession()()).toBe(true);
    });
  });

  describe('setShowCart', () => {
    it('should set showCart value', () => {
      facade.setShowCart(true);

      expect(cartStore.setShowCart).toHaveBeenCalledWith(true);
    });
  });

  describe('loadShoppingSession', () => {
    it('should load shopping session', async () => {
      await facade.loadShoppingSession();

      expect(cartStore.loadShoppingSession).toHaveBeenCalled();
    });
  });
});
