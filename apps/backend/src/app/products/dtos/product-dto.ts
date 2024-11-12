import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { HydratedProduct } from '../entities/hydrated-product';
import { ImageDTO, toImageDTO } from './image-dto';
import { batchConvert } from '../../common/util/batch-convert';
import { ArrayMinSize, IsNumber, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDTO {
  @ApiResponseProperty()
  @MinLength(1)
  id: string;
  @ApiResponseProperty()
  @MinLength(1)
  name: string;
  @ApiResponseProperty()
  @MinLength(1)
  description: string;
  @ApiResponseProperty()
  @ArrayMinSize(1)
  categories: string[];
  @ApiProperty({ isArray: true, type: ImageDTO, readOnly: true })
  @ValidateNested({ each: true })
  @Type(() => ImageDTO)
  images: ImageDTO[];
  @ApiResponseProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price: number;
}

export const toProductDTO = (product: HydratedProduct): ProductDTO => {
  const categories = product.categories.map(category => category.name);
  const images = batchConvert(product.images, toImageDTO);

  return {
    id: product.id.toString(),
    name: product.name,
    description: product.description,
    categories,
    images,
    price: Number(product.price),
  };
};
