import { inject, Injectable } from '@angular/core';
import { DataService } from '@angular-architects/ngrx-toolkit';
import { ProductFilter } from '../models/product-filter';
import { firstValueFrom } from 'rxjs';
import { ProductApi, ProductResponse } from '@demo-shop/api';

@Injectable({
  providedIn: 'root',
})
export class ProductDataService implements DataService<ProductResponse, ProductFilter> {
  readonly #productApi = inject(ProductApi);

  async load(filter: ProductFilter): Promise<ProductResponse[]> {
    const res = await firstValueFrom(this.#productApi.getAllProducts());
    return res.items ?? [];
  }

  loadById(id: number): Promise<ProductResponse> {
    return firstValueFrom(this.#productApi.getProductById(id));
  }

  create(entity: ProductResponse): Promise<ProductResponse> {
    return Promise.reject(new Error('Not implemented'));
  }

  delete(entity: ProductResponse): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }

  update(entity: ProductResponse): Promise<ProductResponse> {
    return Promise.reject(new Error('Not implemented'));
  }

  updateAll(entity: ProductResponse[]): Promise<ProductResponse[]> {
    return Promise.reject(new Error('Not implemented'));
  }
}
