import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';
import { DecodedToken } from '../../common/models/decoded-token';

/**
 * Represents a user's identity with essential personal information.
 * This class is used for authentication and user identification purposes.
 */
export class UserIdentity {
  /**
   * The user's email address.
   * Must be a valid email format.
   */
  @ApiProperty()
  @IsEmail()
  email: string;

  /**
   * The unique identifier for the user in Keycloak.
   * Must be a valid UUID.
   */
  @ApiProperty()
  @IsUUID()
  keycloakUserId: string;

  /**
   * The user's first name.
   * Must be a non-empty string.
   */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  firstname: string;

  /**
   * The user's last name.
   * Must be a non-empty string.
   */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  lastname: string;
}

/**
 * Maps a decoded token object to a UserIdentity object.
 * Extracts relevant user information from the token's claims.
 *
 * @param decodedToken - The decoded JWT token containing user information
 * @returns A UserIdentity object with the user's information
 */
export const fromDecodedToken = (decodedToken: DecodedToken): UserIdentity => ({
  firstname: decodedToken.given_name,
  lastname: decodedToken.family_name,
  email: decodedToken.email,
  keycloakUserId: decodedToken.sub,
});
