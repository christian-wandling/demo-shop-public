import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AddCartItemRequest {
  @ApiProperty()
  @IsInt()
  @Min(1)
  productId: number;
}
