import { Address } from '@prisma/client';
import { ApiResponseProperty } from '@nestjs/swagger';

export class AddressResponse {
  @ApiResponseProperty()
  readonly street: string;
  @ApiResponseProperty()
  readonly apartment: string;
  @ApiResponseProperty()
  readonly city: string;
  @ApiResponseProperty()
  readonly region: string;
  @ApiResponseProperty()
  readonly zip: string;
  @ApiResponseProperty()
  readonly country: string;
}

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
