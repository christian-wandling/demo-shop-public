import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const enableSwagger = app => {
  const config = new DocumentBuilder()
    .addServer('/api')
    .addTag('demo-shop')
    .setTitle('Demo shop')
    .setDescription('The demo shop API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
    operationIdFactory: (controllerKey, methodKey) => methodKey,
  });

  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'api/json',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
