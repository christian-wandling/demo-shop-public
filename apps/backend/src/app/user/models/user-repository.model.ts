import { HydratedUser } from '../entities/hydrated-user';

export interface UserRepositoryModel {
  find(email: string): Promise<HydratedUser>;
}
