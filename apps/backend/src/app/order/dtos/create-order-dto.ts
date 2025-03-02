import { CartItemResponse } from '../../cart-item/dtos/cart-item-response';
import { IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ShoppingSessionResponse } from '../../shopping-session/dtos/shopping-session-response';

export class CreateOrderDto {
  @IsInt()
  @Min(1)
  shoppingSessionId: number;
  @IsInt()
  @Min(1)
  userId: number;
  @ValidateNested({ each: true })
  @Type(() => CartItemResponse)
  items: CartItemResponse[];
}

export const toCreateOrderDto = (shoppingSessionDto: ShoppingSessionResponse): CreateOrderDto => {
  return {
    shoppingSessionId: shoppingSessionDto.id,
    userId: shoppingSessionDto.userId,
    items: shoppingSessionDto.items,
  };
};
