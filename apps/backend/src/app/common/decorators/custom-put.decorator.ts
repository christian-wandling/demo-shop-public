import { applyDecorators, HttpCode, Put, Type } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';

export function CustomPut(options: { path?: string; httpCode?: number; body: Type<unknown>; res: Type<unknown> }) {
  const { path = '', body, res, httpCode = 200 } = options;

  return applyDecorators(Put(path), ApiBody({ type: body }), ApiCreatedResponse({ type: res }), HttpCode(httpCode));
}
