import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { toUserDTO, UserDTO } from './user-dto';
import { HydratedUser } from '../entities/hydrated-user';

describe('UserDTO', () => {
  let validUserData: UserDTO;

  beforeEach(() => {
    validUserData = {
      id: '1',
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
    };
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      const userDto = plainToInstance(UserDTO, validUserData);
      const errors = await validate(userDto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid email', async () => {
      const userDto = plainToInstance(UserDTO, {
        ...validUserData,
        email: 'invalid-email',
      });
      const errors = await validate(userDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with empty firstname', async () => {
      const userDto = plainToInstance(UserDTO, {
        ...validUserData,
        firstname: '',
      });
      const errors = await validate(userDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('firstname');
    });

    it('should fail validation with empty lastname', async () => {
      const userDto = plainToInstance(UserDTO, {
        ...validUserData,
        lastname: '',
      });
      const errors = await validate(userDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('lastname');
    });

    it('should fail validation with invalid phone number', async () => {
      const userDto = plainToInstance(UserDTO, {
        ...validUserData,
        phone: 'invalid-phone',
      });
      const errors = await validate(userDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('phone');
    });
  });

  describe('toUserDTO', () => {
    it('should transform HydratedUser to UserDTO', () => {
      const mockUser: HydratedUser = {
        id: 1,
        keycloakUserId: '1',
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        phone: '+18174264022',
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        address: {
          street: '123 Main St',
          city: 'New York',
          region: 'NY',
          zip: '10001',
          country: 'USA',
          apartment: '1',
          id: 1,
          userId: 1,
        },
      };

      const result = toUserDTO(mockUser);

      expect(result).toEqual({
        id: '1',
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
});
