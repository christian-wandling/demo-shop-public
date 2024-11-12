import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { ProductDTO, toProductDTO } from '../dtos/product-dto';
import { batchConvert } from '../../common/util/batch-convert';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async all(): Promise<ProductDTO[]> {
    return batchConvert(await this.productsRepository.all(), toProductDTO);
  }

  async find(id: string): Promise<ProductDTO> {
    const product = await this.productsRepository.find(id);

    if (!product) {
      throw new NotFoundException();
    }

    return toProductDTO(product);
  }
}
