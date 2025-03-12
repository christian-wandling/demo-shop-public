import { IsDecimal, IsInt, Min, MinLength } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @Min(1)
  product_id: number;
  @MinLength(1)
  product_name: string;
  @MinLength(1)
  product_thumbnail: string;
  @IsInt()
  @Min(1)
  quantity: number;
  @IsDecimal()
  @Min(0.01)
  price: number;
}
