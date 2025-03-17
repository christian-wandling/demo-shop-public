import { inject, Injectable } from '@angular/core';
import { DataService } from '@angular-architects/ngrx-toolkit';
import { firstValueFrom } from 'rxjs';
import { OrderFilter } from '../models/order-filter';
import { OrderApi, OrderResponse } from '@demo-shop/api';

@Injectable({
  providedIn: 'root',
})
export class OrderDataService implements DataService<OrderResponse, OrderFilter> {
  readonly #orderApi = inject(OrderApi);

  async load(filter: OrderFilter): Promise<OrderResponse[]> {
    const res = await firstValueFrom(this.#orderApi.getAllOrdersOfCurrentUser());

    return res?.items ?? [];
  }

  loadById(id: number): Promise<OrderResponse> {
    return firstValueFrom(this.#orderApi.getOrderById(id));
  }

  async create(entity: OrderResponse): Promise<OrderResponse> {
    return Promise.reject(new Error('Not implemented'));
  }

  delete(entity: OrderResponse): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }

  update(entity: OrderResponse): Promise<OrderResponse> {
    return Promise.reject(new Error('Not implemented'));
  }

  updateAll(entity: OrderResponse[]): Promise<OrderResponse[]> {
    return Promise.reject(new Error('Not implemented'));
  }
}
