import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DecodedToken } from '../entities/decoded-token';

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
