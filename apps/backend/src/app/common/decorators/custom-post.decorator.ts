import { applyDecorators, HttpCode, Post, Type } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';

/**
 * Creates a custom POST endpoint decorator that combines multiple decorators for NestJS controllers.
 *
 * This decorator combines the following decorators:
 * - `@Post()` - Defines the HTTP method and route path
 * - `@ApiCreatedResponse()` - Documents the successful response type for Swagger/OpenAPI
 * - `@HttpCode()` - Sets the HTTP status code for the response
 * - `@ApiBody()` - Documents the request body type for Swagger/OpenAPI (if body is provided)
 *
 * @param options.path The route path for the endpoint (default: '')
 * @param options.httpCode The HTTP status code to return (default: 200)
 * @param options.body The type of the request body for Swagger documentation (optional)
 * @param options.res The type of the response for Swagger documentation (required)
 *
 * @returns A composed decorator that can be applied to a controller method
 */
export function CustomPost(options: { path?: string; httpCode?: number; body?: Type<unknown>; res: Type<unknown> }) {
  const { path = '', body, res, httpCode = 200 } = options;

  const decorators = [Post(path), ApiCreatedResponse({ type: res }), HttpCode(httpCode)];

  if (body) {
    decorators.push(ApiBody({ type: body }));
  }

  return applyDecorators(...decorators);
}
