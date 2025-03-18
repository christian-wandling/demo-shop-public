import { applyDecorators, Delete, HttpCode } from '@nestjs/common';
import { ApiNoContentResponse } from '@nestjs/swagger';

/**
 * Custom decorator that combines DELETE HTTP method with specific response code and Swagger documentation
 *
 * @param options.path - Optional path for the endpoint (defaults to empty string)
 * @param options.httpCode - Optional HTTP status code to return (defaults to 204 No Content)
 * @returns Combined decorators for DELETE method, HTTP status code, and API documentation
 */
export function CustomDelete(options: { path?: string; httpCode?: number }) {
  const { path = '', httpCode = 204 } = options;

  return applyDecorators(Delete(path), HttpCode(httpCode), ApiNoContentResponse());
}
