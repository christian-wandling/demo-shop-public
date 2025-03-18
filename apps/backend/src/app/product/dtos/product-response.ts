import { HydratedProduct } from '../entities/hydrated-product';
import { ImageResponse, toImageResponse } from './image-response';
import { batchConvert } from '../../common/util/batch-convert';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for product data
 * Contains all relevant information about a product for API responses
 */
export class ProductResponse {
  /** Unique identifier for the product */
  @ApiProperty()
  readonly id: number;

  /** Name of the product */
  @ApiProperty()
  readonly name: string;

  /** Detailed description of the product */
  @ApiProperty()
  readonly description: string;

  /** List of category names the product belongs to */
  @ApiProperty()
  readonly categories: string[];

  /** Collection of product images with their names and URIs */
  @ApiProperty({ type: [ImageResponse] })
  readonly images: ImageResponse[];

  /** Price of the product in the store's currency */
  @ApiProperty()
  readonly price: number;
  @ApiProperty({ type: ImageResponse })
  readonly thumbnail: ImageResponse;
}

/**
 * Converts a hydrated product entity to a product response DTO
 *
 * @param product - The hydrated product entity containing related data
 * @returns A simplified ProductResponse object ready for API consumption
 */
export const toProductResponse = (product: HydratedProduct): ProductResponse => {
  const categories = product.categories.map(category => category.category.name);
  const images = batchConvert(product.images, toImageResponse);

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    categories,
    images,
    price: Number(product.price),
    thumbnail: images[0],
  };
};
