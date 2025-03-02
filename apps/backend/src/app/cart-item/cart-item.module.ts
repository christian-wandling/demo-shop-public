import { Module } from '@nestjs/common';
import { CartItemService } from './services/cart-item.service';
import { CartItemController } from './cart-item.controller';
import { CartItemRepository } from './services/cart-item.repository';
import { CommonModule } from '../common/common.module';
import { ShoppingSessionModule } from '../shopping-session/shopping-session.module';

@Module({
  imports: [CommonModule, ShoppingSessionModule],
  controllers: [CartItemController],
  providers: [CartItemService, CartItemRepository],
})
export class CartItemModule {}
