import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedProduct } from '../entities/hydrated-product';
import { ProductRepositoryModel } from '../models/product-repository.model';

@Injectable()
export class ProductRepository implements ProductRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

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
        images: true,
      },
    });
  }

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
        images: true,
      },
    });
  }
}
