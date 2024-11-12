import { applyDecorators, Delete, HttpCode } from '@nestjs/common';
import { ApiNoContentResponse } from '@nestjs/swagger';

export function CustomDelete(options: { path?: string; httpCode?: number }) {
  const { path = '', httpCode = 204 } = options;

  return applyDecorators(Delete(path), HttpCode(httpCode), ApiNoContentResponse());
}
