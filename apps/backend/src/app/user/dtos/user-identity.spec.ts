import { UserIdentity, fromDecodedToken } from './user-identity'; // Adjust the import path
import { DecodedToken } from '../../common/models/decoded-token';

describe('CreateUserResponse', () => {
  it('should create a valid CreateUserResponse instance', () => {
    const userDto = new UserIdentity();
    userDto.email = 'test@example.com';
    userDto.keycloakUserId = '123e4567-e89b-12d3-a456-426614174000';
    userDto.firstname = 'John';
    userDto.lastname = 'Doe';

    expect(userDto).toBeInstanceOf(UserIdentity);
    expect(userDto.email).toBe('test@example.com');
    expect(userDto.keycloakUserId).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(userDto.firstname).toBe('John');
    expect(userDto.lastname).toBe('Doe');
  });
});

describe('fromDecodedToken', () => {
  it('should map DecodedToken to CreateUserResponse correctly', () => {
    const decodedToken: DecodedToken = {
      given_name: 'John',
      family_name: 'Doe',
      email: 'test@example.com',
      sub: '123e4567-e89b-12d3-a456-426614174000',
    };

    const userDto = fromDecodedToken(decodedToken);

    expect(userDto).toEqual({
      firstname: 'John',
      lastname: 'Doe',
      email: 'test@example.com',
      keycloakUserId: '123e4567-e89b-12d3-a456-426614174000',
    });
  });
});
