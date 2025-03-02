import { inject, Injectable, Signal } from '@angular/core';
import { OrderStore } from './+state/order.store';
import { OrderResponse } from '@demo-shop/api';

@Injectable({
  providedIn: 'root',
})
export class OrderFacade {
  readonly #orderStore = inject(OrderStore);

  async createOrder(): Promise<void> {
    try {
      await this.#orderStore.create({} as OrderResponse);
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message);
    }
  }

  find(id: number): Signal<OrderResponse> {
    return this.#orderStore.getById(id);
  }

  getAll(): Signal<OrderResponse[]> {
    return this.#orderStore.entities;
  }

  getSortedByStatusAndDate(): Signal<OrderResponse[]> {
    return this.#orderStore.getSortedByStatusAndDate();
  }
}
