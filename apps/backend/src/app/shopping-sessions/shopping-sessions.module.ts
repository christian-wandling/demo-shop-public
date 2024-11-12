import { Module } from '@nestjs/common';
import { ShoppingSessionsService } from './services/shopping-sessions.service';
import { ShoppingSessionsController } from './shopping-sessions.controller';
import { ShoppingSessionsRepository } from './services/shopping-sessions.repository';
import { CommonModule } from '../common/common.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CommonModule, UsersModule],
  controllers: [ShoppingSessionsController],
  providers: [ShoppingSessionsService, ShoppingSessionsRepository],
  exports: [ShoppingSessionsService],
})
export class ShoppingSessionsModule {}
