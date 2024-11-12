import { applyDecorators, HttpCode, Patch, Type } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';

export function CustomPatch(options: { path?: string; httpCode?: number; body: Type<unknown>; res: Type<unknown> }) {
  const { path = '', body, res, httpCode = 201 } = options;

  return applyDecorators(Patch(path), ApiBody({ type: body }), ApiOkResponse({ type: res }), HttpCode(httpCode));
}
