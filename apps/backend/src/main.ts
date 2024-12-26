import './instrument';

import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { enableSwagger } from './app/common/util/enable-swagger';
import { VersioningType } from '@nestjs/common/enums/version-type.enum';

import helmet from 'helmet';
import { CatchEverythingFilter } from './app/common/filters/catch-everything.filter';

async function bootstrap() {
  const globalPrefix = 'api';
  const port = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.use(helmet());
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: [process.env.FRONTEND_URL],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: isProd,
    })
  );

  if (!isProd) {
    enableSwagger(app);
  }

  await app.listen(port);
  Logger.log(`🚀 Application is running on: 'http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
