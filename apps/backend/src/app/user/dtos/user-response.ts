import { HydratedUser } from '../entities/hydrated-user';
import { AddressResponse, toAddressResponse } from './address-response';
import { ApiResponseProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiResponseProperty()
  readonly id: number;
  @ApiResponseProperty()
  readonly email: string;
  @ApiResponseProperty()
  readonly firstname: string;
  @ApiResponseProperty()
  readonly lastname: string;
  @ApiResponseProperty()
  readonly phone?: string;
  @ApiResponseProperty({ type: AddressResponse })
  readonly address?: AddressResponse;
}

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
