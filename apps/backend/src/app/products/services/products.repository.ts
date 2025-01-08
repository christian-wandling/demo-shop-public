import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HydratedProduct } from '../entities/hydrated-product';
import { ProductsRepositoryModel } from '../models/products-repository.model';

@Injectable()
export class ProductsRepository implements ProductsRepositoryModel {
  constructor(private readonly prisma: PrismaService) {}

  all(): Promise<HydratedProduct[]> {
    return this.prisma.product.findMany({
      include: {
        categories: true,
        images: true,
      },
    });
  }

  find(id: number): Promise<HydratedProduct> {
    return this.prisma.product.findUniqueOrThrow({
      where: { id },
      include: {
        categories: true,
        images: true,
      },
    });
  }
}
