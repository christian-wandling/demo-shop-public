import { signalStore, withMethods } from '@ngrx/signals';
import { withCallState, withDataService, withDevtools } from '@angular-architects/ngrx-toolkit';
import { withEntities } from '@ngrx/signals/entities';
import { OrderDataService } from '../services/order-data.service';
import { OrderResponse, OrderStatus } from '@demo-shop/api';
import { computed } from '@angular/core';

export const OrderStore = signalStore(
  { providedIn: 'root' },
  withCallState(),
  withDevtools('orders'),
  withEntities<OrderResponse>(),
  withDataService({
    dataServiceType: OrderDataService,
    filter: {},
  }),
  withMethods(store => ({
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
