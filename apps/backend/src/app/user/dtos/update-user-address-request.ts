import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateUserAddressRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  street: string;
  @ApiProperty()
  @IsString()
  @MinLength(1)
  apartment: string;
  @ApiProperty()
  @IsString()
  @MinLength(1)
  city: string;
  @ApiProperty()
  @IsString()
  @MinLength(1)
  zip: string;
  @ApiProperty()
  @IsString()
  @MinLength(1)
  country: string;
  @ApiProperty({ required: false })
  region?: string | null;
}
