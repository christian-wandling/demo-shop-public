import { Controller, Param } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { OrderResponse } from '../dtos/order-response';
import { Auth } from '../../common/decorators/auth.decorator';
import { CustomGet } from '../../common/decorators/custom-get.decorator';
import { CustomHeaders } from '../../common/decorators/custom-headers.decorator';
import { DecodeTokenPipe } from '../../common/pipes/decode-token-pipe';
import { DecodedToken } from '../../common/models/decoded-token';
import { OrderListResponse } from '../dtos/order-list-response';

@Auth({ roles: ['realm:buy_products'] })
@Controller({ path: 'orders', version: '1' })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @CustomGet({ res: OrderListResponse, isArray: true })
  getAllOrdersOfCurrentUser(
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<OrderListResponse> {
    return this.orderService.findByUser(decodedToken.sub);
  }

  @CustomGet({ path: ':id', res: OrderResponse })
  getOrderById(
    @Param('id') id: string,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<OrderResponse> {
    return this.orderService.find(Number(id), decodedToken.sub);
  }
}
