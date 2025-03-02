import { Module } from '@nestjs/common';
import { OrderRepository } from './services/order.repository';
import { OrderController } from './order.controller';
import { CommonModule } from '../common/common.module';
import { OrderService } from './services/order.service';
import { ShoppingSessionModule } from '../shopping-session/shopping-session.module';

@Module({
  imports: [CommonModule, ShoppingSessionModule],
  providers: [OrderRepository, OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
