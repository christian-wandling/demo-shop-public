import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Enables Swagger documentation for the NestJS application.
 *
 * This function configures and sets up Swagger UI for API documentation.
 * It creates a Swagger document with application metadata and configures
 * the endpoint where the Swagger UI will be available.
 *
 * @param {INestApplication} app - The NestJS application instance
 *
 * @example
 * // In your main.ts file
 * const app = await NestFactory.create(AppModule);
 * enableSwagger(app);
 * await app.listen(3000);
 */
export const enableSwagger = app => {
  const config = new DocumentBuilder()
    .setTitle('Demo Shop API')
    .setDescription(
      'A comprehensive API for managing an online store, providing endpoints for product catalog, user management, shopping cart operations, and order processing'
    )
    .setVersion('v1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    jsonDocumentUrl: '/docs/v1/swagger.json',
    swaggerOptions: {
      persistAuthorization: true,
      urls: [
        {
          url: 'docs/v1/swagger.json',
          name: 'v1',
        },
      ],
    },
    useGlobalPrefix: true,
  });
};
