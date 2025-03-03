import { inject, Injectable, Signal } from '@angular/core';
import { ProductStore } from './+state/product.store';
import { ProductFilter } from './models/product-filter';
import { ProductResponse } from '@demo-shop/api';

@Injectable({
  providedIn: 'root',
})
export class ProductFacade {
  readonly #store = inject(ProductStore);

  load(): void {
    this.#store.load();
  }

  getFiltered(): Signal<ProductResponse[]> {
    return this.#store.filteredEntities;
  }

  getFilter(): Signal<ProductFilter> {
    return this.#store.filter;
  }

  getById(id: number): Signal<ProductResponse> {
    return this.#store.getById(id);
  }

  setFilter(filter: ProductFilter): void {
    this.#store.updateFilter(filter);
  }
}
