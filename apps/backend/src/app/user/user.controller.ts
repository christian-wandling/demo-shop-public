import { UserService } from './services/user.service';
import { UserResponse } from './dtos/user-response';
import { CustomHeaders } from '../common/decorators/custom-headers.decorator';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { CustomController } from '../common/decorators/custom-controller.decorator';
import { Auth } from '../common/decorators/auth.decorator';
import { DecodedToken } from '../common/entities/decoded-token';
import { CustomPost } from '../common/decorators/custom-post.decorator';

@CustomController({ path: 'users', version: '1' })
@Auth({ roles: ['realm:buy_products'] })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @CustomPost({ path: 'me', res: UserResponse })
  async resolveCurrentUser(
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<UserResponse> {
    return await this.userService.getFromToken(decodedToken);
  }
}
