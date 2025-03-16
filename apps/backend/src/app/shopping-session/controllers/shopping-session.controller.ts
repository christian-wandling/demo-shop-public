import { ShoppingSessionService } from '../services/shopping-session.service';
import { ShoppingSessionResponse } from '../dtos/shopping-session-response';
import { Auth } from '../../common/decorators/auth.decorator';
import { CustomPost } from '../../common/decorators/custom-post.decorator';
import { CustomHeaders } from '../../common/decorators/custom-headers.decorator';
import { DecodeTokenPipe } from '../../common/pipes/decode-token-pipe';
import { DecodedToken } from '../../common/models/decoded-token';
import { OrderResponse } from '../../order/dtos/order-response';
import { Controller } from '@nestjs/common';

@Auth({ roles: ['realm:buy_products'] })
@Controller({ path: 'shopping-sessions', version: '1' })
export class ShoppingSessionController {
  constructor(private readonly shoppingSessionsService: ShoppingSessionService) {}

  @CustomPost({ path: 'current', res: ShoppingSessionResponse })
  async resolveShoppingSessionOfCurrentUser(
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<ShoppingSessionResponse> {
    return this.shoppingSessionsService.findCurrentSessionForUser(decodedToken.sub);
  }

  @CustomPost({ path: 'checkout', res: OrderResponse })
  async checkout(@CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken): Promise<OrderResponse> {
    return this.shoppingSessionsService.checkout(decodedToken.sub);
  }
}
