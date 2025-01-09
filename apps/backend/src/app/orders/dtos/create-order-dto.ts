import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { CartItemDTO } from '../../cart-items/dtos/cart-item-dto';
import { IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ShoppingSessionDTO } from '../../shopping-sessions/dtos/shopping-session-dto';

export class CreateOrderDto {
  @ApiResponseProperty()
  @IsInt()
  @Min(1)
  shoppingSessionId: number;
  @ApiResponseProperty()
  @IsInt()
  @Min(1)
  userId: number;
  @ApiProperty({ type: CartItemDTO, isArray: true, readOnly: true })
  @ValidateNested({ each: true })
  @Type(() => CartItemDTO)
  items: CartItemDTO[];
}

export const toCreateOrderDto = (shoppingSessionDto: ShoppingSessionDTO): CreateOrderDto => {
  return {
    shoppingSessionId: shoppingSessionDto.id,
    userId: shoppingSessionDto.userId,
    items: shoppingSessionDto.items,
  };
};
