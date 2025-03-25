import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * Request class for updating a user's phone number
 *
 * This class encapsulates the data needed to update a user's phone number.
 * The phone property is optional and can be null, allowing for phone number removal.
 */
export class UpdateUserPhoneRequest {
  /**
   * The phone number to update
   *
   * @property {string | null} phone - The new phone number value or null to remove the current number
   */
  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  phone: string | null;
}
