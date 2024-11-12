import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { HydratedShoppingSession } from '../entities/hydrated-shopping-session';
import { CartItemDTO, toCartItemDto } from '../../cart-items/dtos/cart-item-dto';
import { batchConvert } from '../../common/util/batch-convert';
import { MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ShoppingSessionDTO {
  @ApiResponseProperty()
  @MinLength(1)
  id: string;
  @ApiResponseProperty()
  @MinLength(1)
  userId: string;
  @ApiProperty({ type: CartItemDTO, isArray: true, readOnly: true })
  @ValidateNested({ each: true })
  @Type(() => CartItemDTO)
  items: CartItemDTO[];
}

export const toShoppingSessionDTO = (shoppingSession: HydratedShoppingSession): ShoppingSessionDTO => {
  const items = batchConvert(shoppingSession.cartItems, toCartItemDto);

  return {
    id: shoppingSession.id.toString(),
    userId: shoppingSession.userId.toString(),
    items,
  };
};
