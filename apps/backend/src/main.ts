import './instrument';

import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { enableSwagger } from './app/common/util/enable-swagger';
import { VersioningType } from '@nestjs/common/enums/version-type.enum';

import helmet from 'helmet';
import { CatchEverythingFilter } from './app/common/filters/catch-everything.filter';

/**
 * Bootstraps the NestJS application with necessary middleware and configuration.
 *
 * Sets up the following:
 * - Helmet for security headers
 * - Global exception filter to catch all errors
 * - CORS configuration with allowed origins from environment
 * - API versioning (defaulting to v1)
 * - Global prefix for all routes
 * - Validation pipe with security settings
 * - Swagger documentation (in non-production environments)
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>} A promise that resolves when the application is successfully started
 * @throws {Error} If the application fails to start or configure properly
 */
async function bootstrap() {
  const globalPrefix = 'api';
  const port = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.use(helmet());
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));
  app.enableCors({
    origin: [process.env.ALLOWED_ORIGIN],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: 'v1',
  });
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: isProd,
    })
  );

  if (!isProd) {
    enableSwagger(app);
    app.use(/^\/(api\/?)?(index\.html)?$/, (req, res) => res.redirect('/api/docs'));
  }

  await app.listen(port);
  Logger.log(`🚀 Application is running on: 'http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
