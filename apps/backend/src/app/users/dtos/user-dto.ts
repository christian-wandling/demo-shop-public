import { ApiResponseProperty } from '@nestjs/swagger';
import { HydratedUser } from '../entities/hydrated-user';
import { AddressDTO, toAddressDTO } from './address-dto';
import { IsEmail, IsInt, IsPhoneNumber, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UserDTO {
  @ApiResponseProperty()
  @IsInt()
  @Min(1)
  id: number;
  @ApiResponseProperty()
  @IsEmail()
  email: string;
  @ApiResponseProperty()
  @MinLength(1)
  firstname: string;
  @ApiResponseProperty()
  @MinLength(1)
  lastname: string;
  @ApiResponseProperty()
  @IsPhoneNumber()
  phone: string;
  @ApiResponseProperty({ type: AddressDTO })
  @Type(() => AddressDTO)
  address: AddressDTO;
}

export const toUserDTO = (user: HydratedUser): UserDTO => {
  const address = toAddressDTO(user.address);

  return {
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    phone: user.phone,
    address,
  };
};
