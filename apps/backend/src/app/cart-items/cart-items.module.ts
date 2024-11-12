import { Module } from '@nestjs/common';
import { CartItemsService } from './services/cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { CartItemsRepository } from './services/cart-items.repository';
import { CommonModule } from '../common/common.module';
import { ShoppingSessionsModule } from '../shopping-sessions/shopping-sessions.module';

@Module({
  imports: [CommonModule, ShoppingSessionsModule],
  controllers: [CartItemsController],
  providers: [CartItemsService, CartItemsRepository],
})
export class CartItemsModule {}
