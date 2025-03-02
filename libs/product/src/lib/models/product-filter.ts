import { ProductResponse } from '@demo-shop/api';

export type AllowedProductFilterTypes = keyof Pick<ProductResponse, 'name' | 'categories'>;

export type ProductFilter = {
  name?: string;
  categories?: string;
};
