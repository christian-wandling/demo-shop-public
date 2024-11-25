import { ForbiddenException, Param } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { OrderDTO } from './dtos/order-dto';
import { Auth } from '../common/decorators/auth.decorator';
import { CustomPost } from '../common/decorators/custom-post.decorator';
import { CustomController } from '../common/decorators/custom-controller.decorator';
import { CustomGet } from '../common/decorators/custom-get.decorator';
import { CustomHeaders } from '../common/decorators/custom-headers.decorator';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { ShoppingSessionsService } from '../shopping-sessions/services/shopping-sessions.service';
import { DecodedToken } from '../common/entities/decoded-token';

@CustomController({ path: 'orders', version: '1' })
@Auth({ roles: ['buy_products'] })
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly shoppingSessionService: ShoppingSessionsService
  ) {}

  @CustomPost({ body: undefined, res: OrderDTO })
  async createOrder(@CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken): Promise<OrderDTO> {
    const shoppingSession = await this.shoppingSessionService.findCurrentSessionForUser(decodedToken.email);

    if (!shoppingSession) {
      throw new ForbiddenException('No active shopping session found. Please login to start a new shopping session.');
    }

    return this.ordersService.createFromShoppingSession(shoppingSession);
  }

  @CustomGet({ res: OrderDTO, isArray: true })
  getOrdersOfCurrentUser(
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<OrderDTO[]> {
    return this.ordersService.findByUser(decodedToken.email);
  }

  @CustomGet({ path: ':id', res: OrderDTO })
  getOrder(
    @Param('id') id: string,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<OrderDTO> {
    return this.ordersService.find(id, decodedToken.email);
  }
}
