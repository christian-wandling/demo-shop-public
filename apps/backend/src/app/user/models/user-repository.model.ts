import { HydratedUser } from '../entities/hydrated-user';
import { UserIdentity } from '../dtos/user-identity';
import { UpdateUserPhoneRequest } from '../dtos/update-user-phone-request';
import { UpdateUserAddressRequest } from '../dtos/update-user-address-request';
import { Address } from '@prisma/client';

export interface UserRepositoryModel {
  findByKeycloakId(keycloakId: string): Promise<HydratedUser>;

  create(dto: UserIdentity): Promise<HydratedUser>;

  updateAddress(user: HydratedUser, request: UpdateUserAddressRequest): Promise<Address>;

  updatePhone(user: HydratedUser, request: UpdateUserPhoneRequest): Promise<HydratedUser>;
}
