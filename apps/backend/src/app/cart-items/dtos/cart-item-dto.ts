import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { IsInt, IsNumber, IsUrl, Min, MinLength } from 'class-validator';

export class CartItemDTO {
  @ApiResponseProperty()
  @MinLength(1)
  id: string;
  @ApiResponseProperty()
  @MinLength(1)
  productId: string;
  @ApiResponseProperty()
  @MinLength(1)
  productName: string;
  @ApiResponseProperty()
  @IsUrl()
  productThumbnail: string;
  @ApiResponseProperty()
  @IsInt()
  @Min(1)
  quantity: number;
  @ApiResponseProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  unitPrice: number;
  @ApiResponseProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  totalPrice: number;
}

export class UpdateCartItemDTO {
  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateCartItemDTO {
  @ApiProperty()
  @MinLength(1)
  productId: string;
}

export const toCartItemDto = (item: HydratedCartItem): CartItemDTO => {
  const productThumbnail = item.product.images?.[0]?.uri;

  return {
    id: item.id.toString(),
    productId: item.productId.toString(),
    productName: item.product.name,
    productThumbnail,
    quantity: item.quantity,
    unitPrice: Number(item.product.price),
    totalPrice: Number(item.product.price) * item.quantity,
  };
};
