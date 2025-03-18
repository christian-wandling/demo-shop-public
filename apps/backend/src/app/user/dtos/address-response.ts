import { Address } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Response object representing a user's address details.
 * Used for API responses when returning address information.
 */
export class AddressResponse {
  /**
   * The street name and number of the address.
   */
  @ApiProperty()
  readonly street: string;

  /**
   * The apartment, suite, or unit number (if applicable).
   */
  @ApiProperty()
  readonly apartment: string;

  /**
   * The city or locality name.
   */
  @ApiProperty()
  readonly city: string;

  /**
   * The region, state, or province.
   */
  @ApiProperty({ nullable: true, required: false })
  readonly region?: string | null;

  /**
   * The postal or zip code.
   */
  @ApiProperty()
  readonly zip: string;

  /**
   * The country name.
   */
  @ApiProperty()
  readonly country: string;
}

/**
 * Converts an internal Address model to an AddressResponse object.
 * Maps the database entity to the API response format.
 *
 * @param address The internal Address entity to convert
 * @returns An AddressResponse object containing the address details
 */
export const toAddressResponse = (address: Address): AddressResponse => {
  return {
    street: address.street,
    apartment: address.apartment,
    city: address.city,
    region: address.region,
    zip: address.zip,
    country: address.country,
  };
};
