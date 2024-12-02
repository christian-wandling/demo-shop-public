import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { enableSwagger } from './app/common/util/enable-swagger';
import { VersioningType } from '@nestjs/common/enums/version-type.enum';

import helmet from 'helmet';

async function bootstrap() {
  const globalPrefix = 'api';
  const port = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: [isProd ? 'https://localhost' : 'http://localhost:4200'],
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

  enableSwagger(app);

  await app.listen(port);
  Logger.log(`🚀 Application is running on: 'http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
