import { toUserResponse } from './user-response';
import { HydratedUser } from '../entities/hydrated-user';

describe('toUserResponse', () => {
  it('should transform HydratedUser to UserResponse', () => {
    const mockUser: HydratedUser = {
      id: 1,
      keycloak_user_id: '1',
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      phone: '+18174264022',
      deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      address: {
        street: '123 Main St',
        city: 'New York',
        region: 'NY',
        zip: '10001',
        country: 'USA',
        apartment: '1',
        id: 1,
        user_id: 1,
        created_at: null,
        updated_at: null,
      },
    };

    const result = toUserResponse(mockUser);

    expect(result).toEqual({
      id: 1,
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      phone: '+18174264022',
      address: {
        street: '123 Main St',
        city: 'New York',
        region: 'NY',
        zip: '10001',
        country: 'USA',
        apartment: '1',
      },
    });
  });
});
