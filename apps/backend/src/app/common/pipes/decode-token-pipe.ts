import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DecodedToken } from '../models/decoded-token';

/**
 * A pipe that transforms an authorization header into a decoded JWT token.
 *
 * This pipe extracts the token from a Bearer authorization header, decodes it using JwtService,
 * and returns a DecodedToken object containing user information.
 *
 * @example
 * // Can be used as a parameter decorator in a controller method
 * @Get('profile')
 * getProfile(@Headers('authorization') @DecodeTokenPipe() decodedToken: DecodedToken) {
 *   // Use decodedToken properties
 * }
 */
@Injectable()
export class DecodeTokenPipe implements PipeTransform {
  constructor(private readonly jwtService: JwtService) {}

  transform(authHeader: string, metadata: ArgumentMetadata): DecodedToken {
    const [type, token] = authHeader.split(' ');

    if (type === 'Bearer' && token) {
      const { given_name, family_name, email, sub } = this.jwtService.decode(token);

      return {
        given_name,
        family_name,
        email,
        sub,
      };
    }

    return undefined;
  }
}
