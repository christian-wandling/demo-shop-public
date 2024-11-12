import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmailFromTokenPipe implements PipeTransform {
  constructor(private readonly jwtService: JwtService) {}

  transform(authHeader: string, metadata: ArgumentMetadata) {
    const [type, token] = authHeader.split(' ');

    if (type === 'Bearer') {
      const { email } = this.jwtService.decode(token);

      return email;
    }
    return undefined;
  }
}
