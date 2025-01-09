import { inject, Injectable, Signal } from '@angular/core';
import { OrderStore } from './+state/order.store';
import { OrderDTO } from '@demo-shop/api';

@Injectable({
  providedIn: 'root',
})
export class OrderFacade {
  readonly #orderStore = inject(OrderStore);

  async createOrder(): Promise<void> {
    try {
      await this.#orderStore.create({} as OrderDTO);
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message);
    }
  }

  find(id: number): Signal<OrderDTO> {
    return this.#orderStore.getById(id);
  }

  getAll(): Signal<OrderDTO[]> {
    return this.#orderStore.entities;
  }

  getSortedByStatusAndDate(): Signal<OrderDTO[]> {
    return this.#orderStore.getSortedByStatusAndDate();
  }
}
