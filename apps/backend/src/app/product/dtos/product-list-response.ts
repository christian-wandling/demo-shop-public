import { ProductResponse } from './product-response';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Response class representing a list of products.
 *
 * This class encapsulates an array of ProductResponse objects to be returned
 * from API endpoints that provide product listing functionality.
 */
export class ProductListResponse {
  /**
   * Array of product response objects.
   *
   * Contains the collection of products returned from the API.
   */
  @ApiProperty({ type: [ProductResponse] })
  readonly items: ProductResponse[];
}
