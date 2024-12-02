import { inject, Injectable } from '@angular/core';
import { DataService } from '@angular-architects/ngrx-toolkit';
import { firstValueFrom } from 'rxjs';
import { OrderFilter } from '../models/order-filter';
import { OrderDTO, OrdersApi } from '@demo-shop/api';

@Injectable({
  providedIn: 'root',
})
export class OrderDataService implements DataService<OrderDTO, OrderFilter> {
  readonly #ordersApi = inject(OrdersApi);

  load(filter: OrderFilter): Promise<OrderDTO[]> {
    return firstValueFrom(this.#ordersApi.getOrdersOfCurrentUser());
  }

  loadById(id: string): Promise<OrderDTO> {
    return firstValueFrom(this.#ordersApi.getOrder(id));
  }

  async create(entity: OrderDTO): Promise<OrderDTO> {
    const order = await firstValueFrom(this.#ordersApi.createOrder());

    await this.load({});

    return order;
  }

  delete(entity: OrderDTO): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }

  update(entity: OrderDTO): Promise<OrderDTO> {
    return Promise.reject(new Error('Not implemented'));
  }

  updateAll(entity: OrderDTO[]): Promise<OrderDTO[]> {
    return Promise.reject(new Error('Not implemented'));
  }
}
