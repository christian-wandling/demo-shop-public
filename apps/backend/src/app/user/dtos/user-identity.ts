import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';
import { DecodedToken } from '../../common/entities/decoded-token';

export class UserIdentity {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsUUID()
  keycloakUserId: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  firstname: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  lastname: string;
}

export const fromDecodedToken = (decodedToken: DecodedToken): UserIdentity => ({
  firstname: decodedToken.given_name,
  lastname: decodedToken.family_name,
  email: decodedToken.email,
  keycloakUserId: decodedToken.sub,
});
