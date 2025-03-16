import { Module } from '@nestjs/common';
import { ShoppingSessionService } from './services/shopping-session.service';
import { ShoppingSessionController } from './controllers/shopping-session.controller';
import { ShoppingSessionRepository } from './services/shopping-session.repository';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [CommonModule, UserModule, OrderModule],
  controllers: [ShoppingSessionController],
  providers: [ShoppingSessionService, ShoppingSessionRepository],
  exports: [ShoppingSessionService],
})
export class ShoppingSessionModule {}
