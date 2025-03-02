import { ShoppingSessionService } from './services/shopping-session.service';
import { ShoppingSessionResponse } from './dtos/shopping-session-response';
import { Auth } from '../common/decorators/auth.decorator';
import { CustomController } from '../common/decorators/custom-controller.decorator';
import { CustomPost } from '../common/decorators/custom-post.decorator';
import { CustomGet } from '../common/decorators/custom-get.decorator';
import { CustomHeaders } from '../common/decorators/custom-headers.decorator';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { DecodedToken } from '../common/entities/decoded-token';

@CustomController({ path: 'shopping-sessions', version: '1' })
@Auth({ roles: ['realm:buy_products'] })
export class ShoppingSessionController {
  constructor(private readonly shoppingSessionsService: ShoppingSessionService) {}

  @CustomPost({ body: undefined, res: ShoppingSessionResponse })
  async createShoppingSession(
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<ShoppingSessionResponse> {
    return this.shoppingSessionsService.create(decodedToken.email);
  }

  @CustomGet({ path: 'current', res: ShoppingSessionResponse })
  async getShoppingSessionOfCurrentUser(
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<ShoppingSessionResponse> {
    return this.shoppingSessionsService.findCurrentSessionForUser(decodedToken.email);
  }
}
