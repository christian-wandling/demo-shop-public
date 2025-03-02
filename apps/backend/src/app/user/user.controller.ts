import { UserService } from './services/user.service';
import { UserResponse } from './dtos/user-response';
import { CustomHeaders } from '../common/decorators/custom-headers.decorator';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { CustomController } from '../common/decorators/custom-controller.decorator';
import { Auth } from '../common/decorators/auth.decorator';
import { CustomGet } from '../common/decorators/custom-get.decorator';
import { DecodedToken } from '../common/entities/decoded-token';
import { MonitoringService } from '../common/services/monitoring.service';

@CustomController({ path: 'users', version: '1' })
@Auth({ roles: ['realm:buy_products'] })
export class UserController {
  constructor(private readonly usersService: UserService, private readonly monitoringService: MonitoringService) {}

  @CustomGet({ path: 'me', res: UserResponse })
  async getCurrentUser(
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<UserResponse> {
    const user: UserResponse = await this.usersService.getFromToken(decodedToken);
    this.monitoringService.setUser({ id: user?.id });
    return user;
  }
}
