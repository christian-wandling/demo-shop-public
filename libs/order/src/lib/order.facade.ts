import { inject, Injectable, Signal } from '@angular/core';
import { OrderStore } from './+state/order.store';
import { OrderResponse } from '@demo-shop/api';

/**
 * Facade service that provides a simplified interface to the OrderStore.
 */
@Injectable({
  providedIn: 'root',
})
export class OrderFacade {
  readonly #orderStore = inject(OrderStore);

  /**
   * Fetches all orders from the backend and puts them in the store
   */
  fetchAll(): void {
    this.#orderStore.load();
  }

  /**
   * Fetches a specific order by its ID and puts it in the store
   */
  fetchById(id: number): void {
    this.#orderStore.fetchById(id);
  }

  /**
   * Get a specific order by its ID from the store
   */
  getById(id: number): Signal<OrderResponse> {
    return this.#orderStore.getById(id);
  }

  /**
   * Get all orders from the store sorted by status and date
   */
  getSortedByStatusAndDate(): Signal<OrderResponse[]> {
    return this.#orderStore.getSortedByStatusAndDate();
  }
}
