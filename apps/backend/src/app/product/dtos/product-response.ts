import { HydratedProduct } from '../entities/hydrated-product';
import { ImageResponse, toImageResponse } from './image-response';
import { batchConvert } from '../../common/util/batch-convert';
import { ApiResponseProperty } from '@nestjs/swagger';

export class ProductResponse {
  @ApiResponseProperty()
  readonly id: number;
  @ApiResponseProperty()
  readonly name: string;
  @ApiResponseProperty()
  readonly description: string;
  @ApiResponseProperty()
  readonly categories: string[];
  @ApiResponseProperty({ type: [ImageResponse] })
  readonly images: ImageResponse[];
  @ApiResponseProperty()
  readonly price: number;
}

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
  };
};
