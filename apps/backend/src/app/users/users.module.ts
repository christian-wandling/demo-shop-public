import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersRepository } from './services/users.repository';
import { CommonModule } from '../common/common.module';
import { UsersService } from './services/users.service';

@Module({
  imports: [CommonModule],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
