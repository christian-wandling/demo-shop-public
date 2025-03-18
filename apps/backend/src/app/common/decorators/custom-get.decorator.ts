import { applyDecorators, Get, Type } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

/**
 * Custom decorator that combines GET HTTP method with Swagger documentation for successful responses
 *
 * @param options.path - Optional path for the endpoint (defaults to empty string)
 * @param options.res - Response type to be used in API documentation
 * @param options.isArray - Optional flag indicating if the response is an array (defaults to false)
 * @returns Combined decorators for GET method and API documentation with appropriate response type
 */
export function CustomGet(options: { path?: string; res: Type<unknown>; isArray?: boolean }) {
  const { path = '', res, isArray = false } = options;

  return applyDecorators(Get(path), ApiOkResponse({ type: res, isArray }));
}
