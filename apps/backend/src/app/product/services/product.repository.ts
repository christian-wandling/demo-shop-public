import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedProduct } from '../entities/hydrated-product';
import { ProductRepositoryModel } from '../interfaces/product-repository.model';

/**
 * Repository class that implements the ProductRepositoryModel interface
 * Handles data access operations for products using Prisma ORM
 */
@Injectable()
export class ProductRepository implements ProductRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all non-deleted products from the database
   * Includes related categories and non-deleted images
   * @returns A promise that resolves to an array of hydrated product objects
   */
  all(): Promise<HydratedProduct[]> {
    return this.prisma.product.findMany({
      where: {
        deleted: false,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        images: {
          where: {
            deleted: false,
          },
        },
      },
    });
  }

  /**
   * Finds a specific product by its unique identifier
   * Only returns non-deleted products and includes related categories and non-deleted images
   * @param id The numeric identifier of the product to find
   * @returns A promise that resolves to the hydrated product
   */
  find(id: number): Promise<HydratedProduct> {
    return this.prisma.product.findUniqueOrThrow({
      where: {
        id,
        deleted: false,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        images: {
          where: {
            deleted: false,
          },
        },
      },
    });
  }
}
