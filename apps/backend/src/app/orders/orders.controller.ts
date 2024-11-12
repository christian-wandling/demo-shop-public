import { NotFoundException, Param } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { OrderDTO } from './dtos/order-dto';
import { Auth } from '../common/decorators/auth.decorator';
import { CustomPost } from '../common/decorators/custom-post.decorator';
import { CustomController } from '../common/decorators/custom-controller.decorator';
import { CustomGet } from '../common/decorators/custom-get.decorator';
import { CustomHeaders } from '../common/decorators/custom-headers.decorator';
import { EmailFromTokenPipe } from '../common/pipes/email-from-token.pipe';
import { ShoppingSessionsService } from '../shopping-sessions/services/shopping-sessions.service';

@CustomController({ path: 'orders', version: '1' })
@Auth({ roles: ['buy_products'] })
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly shoppingSessionService: ShoppingSessionsService
  ) {}

  @CustomPost({ body: undefined, res: OrderDTO })
  async createOrder(@CustomHeaders('authorization', EmailFromTokenPipe) email: string): Promise<OrderDTO> {
    const shoppingSession = await this.shoppingSessionService.findCurrentSessionForUser(email);

    if (!shoppingSession) {
      throw new NotFoundException();
    }

    return this.ordersService.createFromShoppingSession(shoppingSession);
  }

  @CustomGet({ res: OrderDTO, isArray: true })
  getOrdersOfCurrentUser(@CustomHeaders('authorization', EmailFromTokenPipe) email: string): Promise<OrderDTO[]> {
    return this.ordersService.findByUser(email);
  }

  @CustomGet({ path: ':id', res: OrderDTO })
  getOrder(
    @Param('id') id: string,
    @CustomHeaders('authorization', EmailFromTokenPipe) email: string
  ): Promise<OrderDTO> {
    return this.ordersService.find(id, email);
  }
}
