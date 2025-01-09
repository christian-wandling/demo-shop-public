import { Param } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductDTO } from './dtos/product-dto';
import { Public } from 'nest-keycloak-connect';
import { CustomGet } from '../common/decorators/custom-get.decorator';
import { CustomController } from '../common/decorators/custom-controller.decorator';

@CustomController({
  path: 'products',
  version: '1',
})
@Public()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @CustomGet({ res: ProductDTO, isArray: true })
  getAllProducts(): Promise<ProductDTO[]> {
    return this.productsService.all();
  }

  @CustomGet({ path: ':id', res: ProductDTO })
  getProduct(@Param('id') id: number): Promise<ProductDTO> {
    return this.productsService.find(id);
  }
}
