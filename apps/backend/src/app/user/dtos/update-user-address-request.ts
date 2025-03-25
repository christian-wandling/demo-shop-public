import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

/**
 * Data transfer object for updating a user's address information.
 * Contains all the necessary fields required for an address update operation.
 */
export class UpdateUserAddressRequest {
  /**
   * The street name and number of the address.
   * Must be a non-empty string.
   */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  street: string;

  /**
   * The apartment, suite, or unit number of the address.
   * Must be a non-empty string.
   */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  apartment: string;

  /**
   * The city of the address.
   * Must be a non-empty string.
   */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  city: string;

  /**
   * The postal or ZIP code of the address.
   * Must be a non-empty string.
   */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  zip: string;

  /**
   * The country of the address.
   * Must be a non-empty string.
   */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  country: string;

  /**
   * The region, state, or province of the address.
   * Optional field that can be null or undefined.
   */
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  region?: string | null;
}
