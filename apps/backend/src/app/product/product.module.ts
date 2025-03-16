import { Module } from '@nestjs/common';
import { ProductRepository } from './services/product.repository';
import { ProductController } from './controllers/product.controller';
import { CommonModule } from '../common/common.module';
import { ProductService } from './services/product.service';

@Module({
  imports: [CommonModule],
  controllers: [ProductController],
  providers: [ProductRepository, ProductService],
})
export class ProductModule {}
