import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductResponse, toProductResponse } from '../dtos/product-response';
import { batchConvert } from '../../common/util/batch-convert';
import { ProductListResponse } from '../dtos/product-list-response';

/**
 * Service class that handles business logic for product operations
 * Acts as an intermediary between controllers and the repository
 */
@Injectable()
export class ProductService {
  constructor(private readonly productsRepository: ProductRepository) {}

  /**
   * Retrieves all products and converts them to the response format
   * @returns A promise that resolves to a ProductListResponse containing formatted product items
   */
  async all(): Promise<ProductListResponse> {
    return {
      items: batchConvert(await this.productsRepository.all(), toProductResponse),
    };
  }

  /**
   * Finds a specific product by ID and converts it to the response format
   * @param id The numeric identifier of the product to find
   * @returns A promise that resolves to the formatted product response
   * @throws NotFoundException if the product with the given ID doesn't exist
   * @throws InternalServerErrorException for other database errors
   */
  async find(id: number): Promise<ProductResponse> {
    try {
      const product = await this.productsRepository.find(id);
      return toProductResponse(product);
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      throw e;
    }
  }
}
