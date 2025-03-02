import { OrderItem } from '@prisma/client';
import { ApiResponseProperty } from '@nestjs/swagger';

export class OrderItemResponse {
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

export const toOrderItemResponse = (item: OrderItem): OrderItemResponse => {
  return {
    productId: item.product_id,
    productName: item.product_name,
    productThumbnail: item.product_thumbnail,
    quantity: item.quantity,
    unitPrice: Number(item.price),
    totalPrice: Number(item.price) * item.quantity,
  };
};
