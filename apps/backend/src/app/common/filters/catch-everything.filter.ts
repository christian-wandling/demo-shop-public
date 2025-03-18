import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { SentryExceptionCaptured } from '@sentry/nestjs';

/**
 * Global exception filter that catches all exceptions thrown within the application.
 *
 * This filter handles both HTTP exceptions (thrown using NestJS's HttpException) and
 * unhandled exceptions, providing a consistent response format and proper logging.
 * It also integrates with Sentry for error tracking in production environments.
 */
@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  /**
   * Handles all exceptions thrown within the application.
   *
   * This method:
   * 1. Determines if the exception is an HTTP exception or an unhandled exception
   * 2. Sets the appropriate HTTP status code
   * 3. Constructs a standardized response body
   * 4. Sends the response to the client
   * 5. Logs the exception details (in non-production environments)
   *
   * The @SentryExceptionCaptured decorator ensures the exception is sent to Sentry
   * for monitoring and alerting purposes.
   *
   * @param exception - The exception object caught by the filter
   * @param host - The arguments host object providing methods to access the request and response
   */
  @SentryExceptionCaptured()
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const isHttpException = exception instanceof HttpException;
    let httpStatus: number;
    let exceptionPrefix: 'Http' | 'Unhandled';

    if (isHttpException) {
      httpStatus = exception.getStatus();
      exceptionPrefix = 'Http';
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      exceptionPrefix = 'Unhandled';
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);

    if (process.env.NODE_ENV === 'production') {
      return;
    }

    Logger.error(`${exceptionPrefix} Exception: ${exception?.['message']}`, exception?.['stack']);
  }
}
