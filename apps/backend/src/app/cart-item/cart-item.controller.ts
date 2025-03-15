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
import { DecodedToken } from '../common/models/decoded-token';
import { UpdateCartItemQuantityRequest } from './dtos/update-cart-item-quantity-request';
import { AddCartItemRequest } from './dtos/add-cart-item-request';

@CustomController({ path: 'shopping-sessions', version: '1' })
@Auth({ roles: ['realm:buy_products'] })
export class CartItemController {
  constructor(
    private readonly shoppingSessionService: ShoppingSessionService,
    private readonly cartItemService: CartItemService
  ) {}

  @CustomPost({ path: '/current/cart-items', body: AddCartItemRequest, res: CartItemResponse })
  async createCartItem(
    @Body() dto: AddCartItemRequest,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<CartItemResponse> {
    const shoppingSession = await this.shoppingSessionService.findCurrentSessionForUser(decodedToken.sub);

    if (!shoppingSession) {
      throw new ForbiddenException('No active shopping session found. Please login to start a new shopping session.');
    }

    return this.cartItemService.create(dto, shoppingSession.id);
  }

  @CustomPatch({ path: '/current/cart-items/:id', body: UpdateCartItemQuantityRequest, res: CartItemResponse })
  async updateCartItem(
    @Param('id') id: string,
    @Body() dto: UpdateCartItemQuantityRequest,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<CartItemResponse> {
    const shoppingSession = await this.shoppingSessionService.findCurrentSessionForUser(decodedToken.sub);

    if (!shoppingSession) {
      throw new ForbiddenException('No active shopping session found. Please login to start a new shopping session.');
    }

    return this.cartItemService.update(Number(id), dto, shoppingSession.id);
  }

  @CustomDelete({ path: '/current/cart-items/:id' })
  async removeCartItem(
    @Param('id') id: string,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<void> {
    const shoppingSession = await this.shoppingSessionService.findCurrentSessionForUser(decodedToken.sub);

    if (!shoppingSession) {
      throw new ForbiddenException('No active shopping session found. Please login to start a new shopping session.');
    }

    await this.cartItemService.remove(Number(id), shoppingSession.id);
  }
}
