import { applyDecorators, HttpCode, Post, Type } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';

export function CustomPost(options: { path?: string; httpCode?: number; body?: Type<unknown>; res: Type<unknown> }) {
  const { path = '', body, res, httpCode = 200 } = options;

  const decorators = [Post(path), ApiCreatedResponse({ type: res }), HttpCode(httpCode)];

  if (body) {
    decorators.push(ApiBody({ type: body }));
  }

  return applyDecorators(...decorators);
}
