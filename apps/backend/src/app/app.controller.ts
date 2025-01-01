import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get('/test-sentry')
  testSentry() {
    throw new Error('Sentry test error from NestJS endpoint'); // This will be caught by the filter
  }
}
