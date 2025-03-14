import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { withCallState, withDataService, withDevtools } from '@angular-architects/ngrx-toolkit';
import { addEntity, withEntities } from '@ngrx/signals/entities';
import { OrderDataService } from '../services/order-data.service';
import { OrderApi, OrderResponse, OrderStatus } from '@demo-shop/api';
import { computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const OrderStore = signalStore(
  { providedIn: 'root' },
  withCallState(),
  withDevtools('orders'),
  withEntities<OrderResponse>(),
  withDataService({
    dataServiceType: OrderDataService,
    filter: {},
  }),
  withMethods((store, orderApi = inject(OrderApi)) => ({
    async fetchById(id: number) {
      const order = await firstValueFrom(orderApi.getOrderById(id));
      patchState(store, addEntity(order));
    },
    getById(id: number) {
      return computed(() => store.entityMap()[id]);
    },
    getSortedByStatusAndDate() {
      return computed(() =>
        store.entities().sort((a, b) => {
          if (a.status === b.status) {
            return a.created > b.created ? -1 : 1;
          }

          return a.status === OrderStatus.Created ? -1 : 1;
        })
      );
    },
  }))
);
