import { Controller, Param } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { ProductResponse } from '../dtos/product-response';
import { Public } from 'nest-keycloak-connect';
import { CustomGet } from '../../common/decorators/custom-get.decorator';
import { ProductListResponse } from '../dtos/product-list-response';

@Public()
@Controller({ path: 'products', version: '1' })
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @CustomGet({ res: ProductListResponse, isArray: true })
  getAllProducts(): Promise<ProductListResponse> {
    return this.productService.all();
  }

  @CustomGet({ path: ':id', res: ProductResponse })
  getProductById(@Param('id') id: string): Promise<ProductResponse> {
    return this.productService.find(Number(id));
  }
}
