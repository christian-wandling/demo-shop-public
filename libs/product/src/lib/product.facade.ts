import { inject, Injectable, Signal } from '@angular/core';
import { ProductStore } from './+state/product.store';
import { ProductFilter } from './models/product-filter';
import { ProductResponse } from '@demo-shop/api';

/**
 * Facade service that provides a simplified interface for product-related operations
 * by delegating to the ProductStore.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductFacade {
  readonly #store = inject(ProductStore);

  /**
   * Fetches all products from the backend and puts them in the store
   */
  fetchAll(): void {
    this.#store.load();
  }

  /**
   * Fetches a specific product by its ID and puts it in the store
   */
  fetchById(id: number): void {
    this.#store.fetchById(id);
  }

  /**
   * Returns a filtered list of products
   */
  getFiltered(): Signal<ProductResponse[]> {
    return this.#store.filteredEntities;
  }

  /**
   * Returns the current product filter configuration

   */
  getFilter(): Signal<ProductFilter> {
    return this.#store.filter;
  }

  /**
   * Gets a specific product by its ID
   */
  getById(id: number): Signal<ProductResponse> {
    return this.#store.getById(id);
  }

  /**
   * Updates the current filter configuration for products
   */
  setFilter(filter: ProductFilter): void {
    this.#store.updateFilter(filter);
  }
}
