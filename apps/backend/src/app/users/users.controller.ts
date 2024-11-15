import { UsersService } from './services/users.service';
import { UserDTO } from './dtos/user-dto';
import { CustomHeaders } from '../common/decorators/custom-headers.decorator';
import { EmailFromTokenPipe } from '../common/pipes/email-from-token.pipe';
import { CustomController } from '../common/decorators/custom-controller.decorator';
import { Auth } from '../common/decorators/auth.decorator';
import { CustomGet } from '../common/decorators/custom-get.decorator';

@CustomController({ path: 'users', version: '1' })
@Auth({ roles: ['buy_products'] })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @CustomGet({ path: 'me', res: UserDTO })
  getCurrentUser(@CustomHeaders('authorization', EmailFromTokenPipe) email: string): Promise<UserDTO> {
    return this.usersService.findByEmail(email);
  }
}
