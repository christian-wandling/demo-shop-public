import { Body, ForbiddenException, Param } from '@nestjs/common';
import { CartItemService } from './services/cart-item.service';
import { CartItemResponse } from './dtos/cart-item-response';
import { CustomPost } from '../common/decorators/custom-post.decorator';
import { Auth } from '../common/decorators/auth.decorator';
import { CustomController } from '../common/decorators/custom-controller.decorator';
import { CustomHeaders } from '../common/decorators/custom-headers.decorator';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { ShoppingSessionService } from '../shopping-session/services/shopping-session.service';
import { CustomDelete } from '../common/decorators/custom-delete.decorator';
import { CustomPatch } from '../common/decorators/custom-patch.decorator';
import { DecodedToken } from '../common/entities/decoded-token';
import { UpdateCartItemQuantityRequest } from './dtos/update-cart-item-quantity-request';
import { AddCartItemRequest } from './dtos/add-cart-item-request';

@CustomController({ path: 'shopping-sessions/current/cart-items', version: '1' })
@Auth({ roles: ['realm:buy_products'] })
export class CartItemController {
  constructor(
    private readonly shoppingSessionsService: ShoppingSessionService,
    private readonly cartItemsService: CartItemService
  ) {}

  @CustomPost({ body: AddCartItemRequest, res: CartItemResponse })
  async createCartItem(
    @Body() dto: AddCartItemRequest,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<CartItemResponse> {
    const shoppingSession = await this.shoppingSessionsService.findCurrentSessionForUser(decodedToken.email);

    if (!shoppingSession) {
      throw new ForbiddenException('No active shopping session found. Please login to start a new shopping session.');
    }

    return this.cartItemsService.create(dto, shoppingSession.id);
  }

  @CustomPatch({ path: ':id', body: UpdateCartItemQuantityRequest, res: CartItemResponse })
  async updateCartItem(
    @Param('id') id: number,
    @Body() dto: UpdateCartItemQuantityRequest,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<CartItemResponse> {
    const shoppingSession = await this.shoppingSessionsService.findCurrentSessionForUser(decodedToken.email);

    if (!shoppingSession) {
      throw new ForbiddenException('No active shopping session found. Please login to start a new shopping session.');
    }

    return this.cartItemsService.update(id, dto, shoppingSession.id);
  }

  @CustomDelete({ path: ':id' })
  async removeCartItem(
    @Param('id') id: number,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<void> {
    const shoppingSession = await this.shoppingSessionsService.findCurrentSessionForUser(decodedToken.email);

    if (!shoppingSession) {
      throw new ForbiddenException('No active shopping session found. Please login to start a new shopping session.');
    }

    await this.cartItemsService.remove(id, shoppingSession.id);
  }
}
