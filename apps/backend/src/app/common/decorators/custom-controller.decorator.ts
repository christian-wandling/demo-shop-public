import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function CustomController(options: { path: string; version?: string; tags?: string }) {
  const { path, version = '1', tags = path } = options;

  return applyDecorators(Controller({ path, version }), ApiTags(tags));
}
