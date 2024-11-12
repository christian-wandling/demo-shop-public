import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'nest-keycloak-connect';

export function Auth(options: { roles: string[] }) {
  const { roles } = options;

  return applyDecorators(Roles({ roles }), ApiBearerAuth());
}
