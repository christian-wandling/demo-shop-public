import { applyDecorators, HttpCode, Put, Type } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';

/**
 * Creates a custom PUT endpoint decorator that combines multiple NestJS decorators.
 *
 * This decorator wraps the standard NestJS PUT decorator along with Swagger documentation
 * and HTTP code specification. It simplifies the process of creating PUT endpoints with
 * consistent API documentation.
 *
 * @param options.path - Optional URL path for the endpoint (defaults to empty string)
 * @param options.httpCode - Optional HTTP status code to return (defaults to 200)
 * @param options.body - The request body DTO type for Swagger documentation
 * @param options.res - The response DTO type for Swagger documentation
 *
 * @returns A composed decorator that applies Put, ApiBody, ApiCreatedResponse, and HttpCode decorators
 */
export function CustomPut(options: { path?: string; httpCode?: number; body: Type<unknown>; res: Type<unknown> }) {
  const { path = '', body, res, httpCode = 200 } = options;

  return applyDecorators(Put(path), ApiBody({ type: body }), ApiCreatedResponse({ type: res }), HttpCode(httpCode));
}
