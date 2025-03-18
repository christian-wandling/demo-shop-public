import { ShoppingSessionService } from '../services/shopping-session.service';
import { ShoppingSessionResponse } from '../dtos/shopping-session-response';
import { Auth } from '../../common/decorators/auth.decorator';
import { CustomPost } from '../../common/decorators/custom-post.decorator';
import { CustomHeaders } from '../../common/decorators/custom-headers.decorator';
import { DecodeTokenPipe } from '../../common/pipes/decode-token-pipe';
import { DecodedToken } from '../../common/models/decoded-token';
import { OrderResponse } from '../../order/dtos/order-response';
import { Controller } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Controller handling HTTP requests related to shopping sessions
 * Requires authentication with the 'realm:buy_products' role
 */
@Auth({ roles: ['realm:buy_products'] })
@ApiTags('shopping-session')
@Controller({ path: 'shopping-sessions', version: '1' })
export class ShoppingSessionController {
  constructor(private readonly shoppingSessionsService: ShoppingSessionService) {}

  /**
   * Resolves and returns the current shopping session for the authenticated user
   * @param decodedToken The decoded authentication token containing user information
   * @returns A promise that resolves to the user's current shopping session data
   */
  @ApiOperation({
    summary: 'Resolve current shopping session',
    description: 'Resolve current shopping session based on identity extracted from bearer token',
    operationId: 'ResolveCurrentShoppingSession',
  })
  @CustomPost({ path: 'current', res: ShoppingSessionResponse })
  async resolveCurrentShoppingSession(
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<ShoppingSessionResponse> {
    return this.shoppingSessionsService.findCurrentSessionForUser(decodedToken.sub);
  }

  /**
   * Processes checkout for the authenticated user's current shopping session
   * Converts the shopping session into an order
   * @param decodedToken The decoded authentication token containing user information
   * @returns A promise that resolves to the newly created order data
   */
  @ApiOperation({
    summary: 'Checkout current shopping session',
    description:
      'Check out by creating an order from the current shopping session and deleting the shopping session afterwards',
    operationId: 'Checkout',
  })
  @CustomPost({ path: 'checkout', res: OrderResponse })
  async checkout(@CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken): Promise<OrderResponse> {
    return this.shoppingSessionsService.checkout(decodedToken.sub);
  }
}
