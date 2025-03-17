import { ProductResponse } from '@demo-shop/api';

/**
 * Represents the allowed property keys from ProductResponse that can be used for filtering products.
 * This type ensures that only valid properties are used as filter criteria.
 */
export type AllowedProductFilterTypes = keyof Pick<ProductResponse, 'name' | 'categories'>;

/**
 * Defines the structure for filtering products.
 * Each property is optional and represents a different filter criterion.
 *
 * @property {string} [name] - Optional filter for product name
 * @property {string} [categories] - Optional filter for product categories
 */
export type ProductFilter = {
  name?: string;
  categories?: string;
};
