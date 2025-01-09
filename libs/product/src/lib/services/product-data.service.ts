import { inject, Injectable } from '@angular/core';
import { DataService } from '@angular-architects/ngrx-toolkit';
import { ProductFilter } from '../models/product-filter';
import { firstValueFrom } from 'rxjs';
import { ProductDTO, ProductsApi } from '@demo-shop/api';

@Injectable({
  providedIn: 'root',
})
export class ProductDataService implements DataService<ProductDTO, ProductFilter> {
  readonly #productsApi = inject(ProductsApi);

  load(filter: ProductFilter): Promise<ProductDTO[]> {
    return firstValueFrom(this.#productsApi.getAllProducts());
  }

  loadById(id: number): Promise<ProductDTO> {
    return firstValueFrom(this.#productsApi.getProduct(id));
  }

  create(entity: ProductDTO): Promise<ProductDTO> {
    return Promise.reject(new Error('Not implemented'));
  }

  delete(entity: ProductDTO): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }

  update(entity: ProductDTO): Promise<ProductDTO> {
    return Promise.reject(new Error('Not implemented'));
  }

  updateAll(entity: ProductDTO[]): Promise<ProductDTO[]> {
    return Promise.reject(new Error('Not implemented'));
  }
}
