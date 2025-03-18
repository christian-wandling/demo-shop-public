import { applyDecorators, HttpCode, Patch, Type } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';

/**
 * Custom decorator that combines PATCH HTTP method with request body validation, response documentation, and status code
 *
 * @param options.path - Optional path for the endpoint (defaults to empty string)
 * @param options.httpCode - Optional HTTP status code to return (defaults to 200 OK)
 * @param options.body - Type used for request body validation and Swagger documentation
 * @param options.res - Response type to be used in API documentation
 * @returns Combined decorators for PATCH method, body validation, API documentation, and HTTP status code
 */
export function CustomPatch(options: { path?: string; httpCode?: number; body: Type<unknown>; res: Type<unknown> }) {
  const { path = '', body, res, httpCode = 200 } = options;

  return applyDecorators(Patch(path), ApiBody({ type: body }), ApiOkResponse({ type: res }), HttpCode(httpCode));
}
