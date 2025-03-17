import { inject, Injectable, Signal } from '@angular/core';
import { CartStore } from './+state/cart.store';
import { CartItemResponse, ShoppingSessionApi } from '@demo-shop/api';
import { firstValueFrom } from 'rxjs';

/**
 * Facade to abstract interactions with cart store, api and checkout feature
 */
@Injectable({
  providedIn: 'root',
})
export class CartFacade {
  readonly #cartStore = inject(CartStore);
  readonly #shoppingSessionApi = inject(ShoppingSessionApi);

  /**
   * Returns all cart items from the store
   */
  getAll(): Signal<CartItemResponse[]> {
    return this.#cartStore.entities;
  }

  /**
   * Returns the calculated total price of all items in the cart
   */
  getTotalPrice(): Signal<number> {
    return this.#cartStore.totalPrice;
  }

  /**
   * Returns the total number of items in the cart
   */
  getItemCount(): Signal<number> {
    return this.#cartStore.itemCount;
  }

  /**
   * Adds a product to the cart
   * If the product is already in the cart, increases its quantity by 1
   * Otherwise, creates a new cart item for the product
   */
  addItem(productId: number): void {
    const item = this.#cartStore.getItemByProductId(productId);

    if (item) {
      this.updateItem(item.id, item.quantity + 1);
    } else {
      this.#cartStore.create({
        productId,
      });
    }
  }

  /**
   * Updates the quantity of a specific cart item
   */
  updateItem(id: number, quantity: number): void {
    this.#cartStore.update(id, { quantity });
  }

  /**
   * Removes an item from the cart
   * If quantity is greater than 1, decreases quantity by 1
   * Otherwise, removes the item completely
   */
  removeItem(id: number): void {
    const item = this.#cartStore.getItemById(id);

    if (item && item.quantity > 1) {
      this.updateItem(item.id, item.quantity - 1);
    } else {
      this.#cartStore.delete(id);
    }
  }

  /**
   * Returns whether the cart should be displayed
   */
  getShowCart(): Signal<boolean> {
    return this.#cartStore.showCart;
  }

  /**
   * Returns whether an active shopping session exists
   */
  getHasShoppingSession(): Signal<boolean> {
    return this.#cartStore.hasShoppingSession;
  }

  /**
   * Controls the visibility of the cart UI
   */
  setShowCart(showCart: boolean): void {
    this.#cartStore.setShowCart(showCart);
  }

  /**
   * Fetches the current shopping session data from the server and puts it in the store
   */
  async loadShoppingSession(): Promise<void> {
    await this.#cartStore.loadShoppingSession();
  }

  /**
   * Processes checkout for the current cart
   * Reloads shopping session data after successful checkout
   * @throws Error if checkout fails
   */
  async checkout(): Promise<void> {
    try {
      await firstValueFrom(this.#shoppingSessionApi.checkout());
      await this.loadShoppingSession();
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message);
    }
  }
}
