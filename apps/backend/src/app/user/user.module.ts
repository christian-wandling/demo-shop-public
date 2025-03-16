import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './services/user.repository';
import { CommonModule } from '../common/common.module';
import { UserService } from './services/user.service';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
