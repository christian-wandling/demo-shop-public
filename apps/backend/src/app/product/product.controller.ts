import { Param } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductResponse } from './dtos/product-response';
import { Public } from 'nest-keycloak-connect';
import { CustomGet } from '../common/decorators/custom-get.decorator';
import { CustomController } from '../common/decorators/custom-controller.decorator';
import { ProductListResponse } from './dtos/product-list-response';

@CustomController({
  path: 'products',
  version: '1',
})
@Public()
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @CustomGet({ res: ProductListResponse, isArray: true })
  getAllProducts(): Promise<ProductListResponse> {
    return this.productsService.all();
  }

  @CustomGet({ path: ':id', res: ProductResponse })
  getProductById(@Param('id') id: number): Promise<ProductResponse> {
    return this.productsService.find(id);
  }
}
