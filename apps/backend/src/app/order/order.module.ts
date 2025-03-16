import { Module } from '@nestjs/common';
import { OrderRepository } from './services/order.repository';
import { OrderController } from './controllers/order.controller';
import { CommonModule } from '../common/common.module';
import { OrderService } from './services/order.service';

@Module({
  imports: [CommonModule],
  providers: [OrderRepository, OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
