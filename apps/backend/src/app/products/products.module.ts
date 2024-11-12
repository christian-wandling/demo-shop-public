import { Module } from '@nestjs/common';
import { ProductsRepository } from './services/products.repository';
import { ProductsController } from './products.controller';
import { CommonModule } from '../common/common.module';
import { ProductsService } from './services/products.service';

@Module({
  imports: [CommonModule],
  controllers: [ProductsController],
  providers: [ProductsRepository, ProductsService],
})
export class ProductsModule {}
