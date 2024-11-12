import { ProductDTO } from '@demo-shop/api';

export type AllowedProductFilterTypes = keyof Pick<ProductDTO, 'name' | 'categories'>;

export type ProductFilter = {
  name?: string;
  categories?: string;
};
