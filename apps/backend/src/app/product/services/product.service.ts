import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductResponse, toProductResponse } from '../dtos/product-response';
import { batchConvert } from '../../common/util/batch-convert';
import { ProductListResponse } from '../dtos/product-list-response';

@Injectable()
export class ProductService {
  constructor(private readonly productsRepository: ProductRepository) {}

  async all(): Promise<ProductListResponse> {
    return {
      items: batchConvert(await this.productsRepository.all(), toProductResponse),
    };
  }

  async find(id: number): Promise<ProductResponse> {
    const product = await this.productsRepository.find(id);

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    return toProductResponse(product);
  }
}
