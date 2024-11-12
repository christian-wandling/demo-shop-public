import { signalStore, withComputed, withHooks, withMethods } from '@ngrx/signals';
import { withCallState, withDataService, withDevtools } from '@angular-architects/ngrx-toolkit';
import { withEntities } from '@ngrx/signals/entities';
import { ProductDataService } from '../services/product-data.service';
import { computed } from '@angular/core';
import { AllowedProductFilterTypes } from '../models/product-filter';
import { ProductDTO } from '@demo-shop/api';

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withCallState(),
  withDevtools('products'),
  withEntities<ProductDTO>(),
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
        filterValues.every(([key, filterValue]) => entity[key as AllowedProductFilterTypes].includes(filterValue))
      );
    }),
  })),
  withMethods(store => ({
    getById(id: string) {
      return computed(() => store.entityMap()[id]);
    },
  }))
);
