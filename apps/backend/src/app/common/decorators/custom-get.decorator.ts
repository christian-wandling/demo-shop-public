import { applyDecorators, Get, Type } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

export function CustomGet(options: { path?: string; res: Type<unknown>; isArray?: boolean }) {
  const { path = '', res, isArray = false } = options;

  return applyDecorators(Get(path), ApiOkResponse({ type: res, isArray }));
}
