import { inject, Injectable, Signal } from '@angular/core';
import { CartStore } from './+state/cart.store';
import { CartItemDTO } from '@demo-shop/api';

@Injectable({
  providedIn: 'root',
})
export class CartFacade {
  readonly #cartStore = inject(CartStore);

  getAll(): Signal<CartItemDTO[]> {
    return this.#cartStore.entities;
  }

  getTotalPrice(): Signal<number> {
    return this.#cartStore.totalPrice;
  }

  getItemCount(): Signal<number> {
    return this.#cartStore.itemCount;
  }

  addItem(productId: string): void {
    const item = this.#cartStore.getItemByProductId(productId);

    if (item) {
      this.updateItem(item.id, item.quantity + 1);
    } else {
      this.#cartStore.create({
        productId,
      });
    }
  }

  updateItem(id: string, quantity: number): void {
    this.#cartStore.update(id, { quantity });
  }

  removeItem(id: string): void {
    const item = this.#cartStore.getItemById(id);

    if (item && item.quantity > 1) {
      this.updateItem(item.id, item.quantity - 1);
    } else {
      this.#cartStore.delete(id);
    }
  }

  getShowCart(): Signal<boolean> {
    return this.#cartStore.showCart;
  }

  getHasShoppingSession(): Signal<boolean> {
    return this.#cartStore.hasShoppingSession;
  }

  setShowCart(showCart: boolean): void {
    this.#cartStore.setShowCart(showCart);
  }

  async loadShoppingSession(): Promise<void> {
    await this.#cartStore.loadShoppingSession();
  }
}