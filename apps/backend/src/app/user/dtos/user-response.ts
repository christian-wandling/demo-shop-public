import { HydratedUser } from '../entities/hydrated-user';
import { AddressResponse, toAddressResponse } from './address-response';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Response class representing user data returned to clients
 *
 * This class defines the structure of user data that is exposed through API responses.
 * It contains basic user information and optionally includes address details.
 */
export class UserResponse {
  /**
   * The unique identifier of the user
   */
  @ApiProperty()
  readonly id: number;

  /**
   * The email address of the user
   */
  @ApiProperty()
  readonly email: string;

  /**
   * The first name of the user
   */
  @ApiProperty()
  readonly firstname: string;

  /**
   * The last name of the user
   */
  @ApiProperty()
  readonly lastname: string;

  /**
   * The phone number of the user (optional)
   */
  @ApiProperty({ nullable: true })
  readonly phone: string;

  /**
   * The address information of the user (optional)
   */
  @ApiProperty({ type: AddressResponse, required: false })
  readonly address?: AddressResponse;
}

/**
 * Converts a hydrated user entity to a user response DTO
 *
 * This utility function transforms the internal user representation to the external
 * format that is suitable for API responses, handling optional fields like address.
 *
 * @param user - The hydrated user entity to be converted
 * @returns A UserResponse object containing the user's public information
 */
export const toUserResponse = (user: HydratedUser): UserResponse => {
  const address = user.address && toAddressResponse(user.address);

  return {
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    phone: user.phone,
    address,
  };
};
