import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { ApiResponseProperty } from '@nestjs/swagger';

export class CartItemResponse {
  @ApiResponseProperty()
  readonly id: number;
  @ApiResponseProperty()
  readonly productId: number;
  @ApiResponseProperty()
  readonly productName: string;
  @ApiResponseProperty()
  readonly productThumbnail: string;
  @ApiResponseProperty()
  readonly quantity: number;
  @ApiResponseProperty()
  readonly unitPrice: number;
  @ApiResponseProperty()
  readonly totalPrice: number;
}

export const toCartItemResponse = (item: HydratedCartItem): CartItemResponse => {
  const productThumbnail = item.product.images?.[0]?.uri;

  return {
    id: item.id,
    productId: item.product_id,
    productName: item.product.name,
    productThumbnail,
    quantity: item.quantity,
    unitPrice: Number(item.product.price),
    totalPrice: Number(item.product.price) * item.quantity,
  };
};
