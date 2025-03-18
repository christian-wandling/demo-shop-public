import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Service that extends PrismaClient to provide database access within a NestJS application.
 *
 * This service automatically establishes a database connection when the NestJS module
 * is initialized, ensuring the database is ready for use across the application.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Lifecycle hook that runs when the module is initialized.
   * Establishes a connection to the database using Prisma.
   *
   * @returns {Promise<void>} A promise that resolves when the database connection is established
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
}
