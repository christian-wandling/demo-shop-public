import { inject, Injectable, Signal } from '@angular/core';
import { OrderStore } from './+state/order.store';
import { OrderResponse } from '@demo-shop/api';

@Injectable({
  providedIn: 'root',
})
export class OrderFacade {
  readonly #orderStore = inject(OrderStore);

  fetchAll(): void {
    this.#orderStore.load();
  }

  fetchById(id: number): void {
    this.#orderStore.fetchById(id);
  }

  add(order: OrderResponse): void {
    this.#orderStore.create(order);
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
