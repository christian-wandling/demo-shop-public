import { ApiResponseProperty } from '@nestjs/swagger';
import { Address } from '@prisma/client';
import { MinLength } from 'class-validator';

export class AddressDTO {
  @ApiResponseProperty()
  @MinLength(1)
  street: string;
  @ApiResponseProperty()
  @MinLength(1)
  apartment: string;
  @ApiResponseProperty()
  @MinLength(1)
  city: string;
  @ApiResponseProperty()
  @MinLength(1)
  region: string;
  @ApiResponseProperty()
  @MinLength(1)
  zip: string;
  @ApiResponseProperty()
  @MinLength(1)
  country: string;
}

export const toAddressDTO = (address: Address): AddressDTO => {
  return {
    street: address?.street,
    apartment: address?.apartment,
    city: address?.city,
    region: address?.region,
    zip: address?.zip,
    country: address?.country,
  };
};
