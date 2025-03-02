import { ForbiddenException, Param } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderResponse } from './dtos/order-response';
import { Auth } from '../common/decorators/auth.decorator';
import { CustomPost } from '../common/decorators/custom-post.decorator';
import { CustomController } from '../common/decorators/custom-controller.decorator';
import { CustomGet } from '../common/decorators/custom-get.decorator';
import { CustomHeaders } from '../common/decorators/custom-headers.decorator';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { ShoppingSessionService } from '../shopping-session/services/shopping-session.service';
import { DecodedToken } from '../common/entities/decoded-token';
import { OrderListResponse } from './dtos/order-list-response';

@CustomController({ path: 'orders', version: '1' })
@Auth({ roles: ['realm:buy_products'] })
export class OrderController {
  constructor(
    private readonly ordersService: OrderService,
    private readonly shoppingSessionService: ShoppingSessionService
  ) {}

  @CustomPost({ body: undefined, res: OrderResponse })
  async createOrder(
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<OrderResponse> {
    const shoppingSession = await this.shoppingSessionService.findCurrentSessionForUser(decodedToken.email);

    if (!shoppingSession) {
      throw new ForbiddenException('No active shopping session found. Please login to start a new shopping session.');
    }

    return this.ordersService.create(shoppingSession);
  }

  @CustomGet({ res: OrderListResponse, isArray: true })
  getAllOrdersOfCurrentUser(
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<OrderListResponse> {
    return this.ordersService.findByUser(decodedToken.email);
  }

  @CustomGet({ path: ':id', res: OrderResponse })
  getOrderById(
    @Param('id') id: number,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<OrderResponse> {
    return this.ordersService.find(id, decodedToken.email);
  }
}
