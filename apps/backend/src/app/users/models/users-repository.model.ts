import { HydratedUser } from '../entities/hydrated-user';

export interface UsersRepositoryModel {
  find(email: string): Promise<HydratedUser>;
}
