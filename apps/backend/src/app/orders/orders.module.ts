import { Module } from '@nestjs/common';
import { OrdersRepository } from './services/orders.repository';
import { OrdersController } from './orders.controller';
import { CommonModule } from '../common/common.module';
import { OrdersService } from './services/orders.service';
import { ShoppingSessionsModule } from '../shopping-sessions/shopping-sessions.module';

@Module({
  imports: [CommonModule, ShoppingSessionsModule],
  providers: [OrdersRepository, OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
