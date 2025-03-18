import { Controller, Param } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { OrderResponse } from '../dtos/order-response';
import { Auth } from '../../common/decorators/auth.decorator';
import { CustomGet } from '../../common/decorators/custom-get.decorator';
import { CustomHeaders } from '../../common/decorators/custom-headers.decorator';
import { DecodeTokenPipe } from '../../common/pipes/decode-token-pipe';
import { DecodedToken } from '../../common/models/decoded-token';
import { OrderListResponse } from '../dtos/order-list-response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Controller for managing order operations.
 * Requires 'realm:buy_products' role for access.
 */
@Auth({ roles: ['realm:buy_products'] })
@ApiTags('order')
@Controller({ path: 'orders', version: '1' })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Retrieves all orders for the currently authenticated user.
   * @param decodedToken - The decoded JWT token containing user information
   * @returns A promise that resolves to a list of orders for the current user
   */
  @ApiOperation({
    summary: 'Get all orders',
    description: 'Get all orders of current user based on identity extracted from bearer token',
    operationId: 'GetAllOrdersOfCurrentUser',
  })
  @CustomGet({ res: OrderListResponse })
  getAllOrdersOfCurrentUser(
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<OrderListResponse> {
    return this.orderService.findByUser(decodedToken.sub);
  }

  /**
   * Retrieves a specific order by its ID for the current user.
   * @param id - The unique identifier of the order
   * @param decodedToken - The decoded JWT token containing user information
   * @returns A promise that resolves to the requested order details
   */
  @ApiOperation({
    summary: 'Get order by id',
    description: 'Get order by id of current user based on identity extracted from bearer token',
    operationId: 'GetOrderById',
  })
  @CustomGet({ path: ':id', res: OrderResponse })
  getOrderById(
    @Param('id') id: number,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<OrderResponse> {
    return this.orderService.find(Number(id), decodedToken.sub);
  }
}
