import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { SentryExceptionCaptured } from '@sentry/nestjs';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

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
