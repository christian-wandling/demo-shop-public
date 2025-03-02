import { Module } from '@nestjs/common';
import { ShoppingSessionService } from './services/shopping-session.service';
import { ShoppingSessionController } from './shopping-session.controller';
import { ShoppingSessionRepository } from './services/shopping-session.repository';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CommonModule, UserModule],
  controllers: [ShoppingSessionController],
  providers: [ShoppingSessionService, ShoppingSessionRepository],
  exports: [ShoppingSessionService],
})
export class ShoppingSessionModule {}
