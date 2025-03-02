import { signalStore, withComputed, withHooks, withMethods } from '@ngrx/signals';
import { withCallState, withDataService, withDevtools } from '@angular-architects/ngrx-toolkit';
import { withEntities } from '@ngrx/signals/entities';
import { ProductDataService } from '../services/product-data.service';
import { computed } from '@angular/core';
import { AllowedProductFilterTypes } from '../models/product-filter';
import { ProductResponse } from '@demo-shop/api';

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withCallState(),
  withDevtools('products'),
  withEntities<ProductResponse>(),
  withDataService({
    dataServiceType: ProductDataService,
    filter: {},
  }),
  withHooks({
    onInit({ load }) {
      load();
    },
  }),
  withComputed(({ entities, filter }) => ({
    filteredEntities: computed(() => {
      const filterValues = Object.entries(filter());

      if (filterValues.length === 0) {
        return entities();
      }

      return entities().filter(entity =>
        filterValues.every(([key, filterValue]) => {
          const value = entity[key as AllowedProductFilterTypes];

          if (Array.isArray(value)) {
            return value.some(item => item.toLowerCase().includes(filterValue.toLowerCase()));
          }

          return value.toLowerCase().includes(filterValue.toLowerCase());
        })
      );
    }),
  })),
  withMethods(store => ({
    getById(id: number) {
      return computed(() => store.entityMap()[id]);
    },
  }))
);
