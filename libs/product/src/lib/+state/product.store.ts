import { patchState, signalStore, withComputed, withMethods } from '@ngrx/signals';
import { withCallState, withDataService, withDevtools } from '@angular-architects/ngrx-toolkit';
import { addEntity, withEntities } from '@ngrx/signals/entities';
import { ProductDataService } from '../services/product-data.service';
import { computed, inject } from '@angular/core';
import { AllowedProductFilterTypes } from '../models/product-filter';
import { ProductApi, ProductResponse } from '@demo-shop/api';
import { firstValueFrom } from 'rxjs';

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withCallState(),
  withDevtools('products'),
  withEntities<ProductResponse>(),
  withDataService({
    dataServiceType: ProductDataService,
    filter: {},
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
  withMethods((store, productApi = inject(ProductApi)) => ({
    async fetchById(id: number) {
      const product = await firstValueFrom(productApi.getProductById(id));
      patchState(store, addEntity(product));
    },
    getById(id: number) {
      return computed(() => store.entityMap()[id]);
    },
  }))
);
