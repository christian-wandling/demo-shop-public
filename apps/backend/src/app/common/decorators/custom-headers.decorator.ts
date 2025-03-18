import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom parameter decorator that extracts HTTP headers from the request
 *
 * @param data - Optional header name to extract a specific header
 * @param ctx - Execution context providing access to the underlying request
 * @returns All headers if no specific header name is provided, or the value of the specified header
 *
 * @example
 * // Get all headers
 * @Get()
 * findAll(@CustomHeaders() headers) { ... }
 *
 * @example
 * // Get a specific header
 * @Get()
 * findOne(@CustomHeaders('authorization') auth) { ... }
 */
export const CustomHeaders = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return data && typeof data === 'string' ? req.headers[data] : req.headers;
});
