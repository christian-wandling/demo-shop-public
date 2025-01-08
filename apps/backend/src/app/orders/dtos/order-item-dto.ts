import { ApiResponseProperty } from '@nestjs/swagger';
import { OrderItem } from '@prisma/client';
import { IsInt, IsNumber, IsUrl, Min, MinLength } from 'class-validator';

export class OrderItemDTO {
  @ApiResponseProperty()
  @IsInt()
  @Min(1)
  productId: number;
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

export const toOrderItemDTO = (item: OrderItem): OrderItemDTO => {
  return {
    productId: item.productId,
    productName: item.productName,
    productThumbnail: item.productThumbnail,
    quantity: item.quantity,
    unitPrice: Number(item.price),
    totalPrice: Number(item.price) * item.quantity,
  };
};
