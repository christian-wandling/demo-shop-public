import { Body, ForbiddenException, Param } from '@nestjs/common';
import { CartItemsService } from './services/cart-items.service';
import { CartItemDTO, CreateCartItemDTO, UpdateCartItemDTO } from './dtos/cart-item-dto';
import { CustomPost } from '../common/decorators/custom-post.decorator';
import { Auth } from '../common/decorators/auth.decorator';
import { CustomController } from '../common/decorators/custom-controller.decorator';
import { CustomHeaders } from '../common/decorators/custom-headers.decorator';
import { DecodeTokenPipe } from '../common/pipes/decode-token-pipe';
import { ShoppingSessionsService } from '../shopping-sessions/services/shopping-sessions.service';
import { CustomDelete } from '../common/decorators/custom-delete.decorator';
import { CustomPatch } from '../common/decorators/custom-patch.decorator';
import { DecodedToken } from '../common/entities/decoded-token';

@CustomController({ path: 'cart-items', version: '1' })
@Auth({ roles: ['buy_products'] })
export class CartItemsController {
  constructor(
    private readonly shoppingSessionsService: ShoppingSessionsService,
    private readonly cartItemsService: CartItemsService
  ) {}

  @CustomPost({ body: CreateCartItemDTO, res: CartItemDTO })
  async createCartItem(
    @Body() dto: CreateCartItemDTO,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<CartItemDTO> {
    const shoppingSession = await this.shoppingSessionsService.findCurrentSessionForUser(decodedToken.email);

    if (!shoppingSession) {
      throw new ForbiddenException('No active shopping session found. Please login to start a new shopping session.');
    }

    return this.cartItemsService.create(dto, shoppingSession.id);
  }

  @CustomPatch({ path: ':id', body: UpdateCartItemDTO, res: CartItemDTO })
  async updateCartItem(
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDTO,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<CartItemDTO> {
    const shoppingSession = await this.shoppingSessionsService.findCurrentSessionForUser(decodedToken.email);

    if (!shoppingSession) {
      throw new ForbiddenException('No active shopping session found. Please login to start a new shopping session.');
    }

    return this.cartItemsService.update(id, dto, shoppingSession.id);
  }

  @CustomDelete({ path: ':id' })
  async removeCartItem(
    @Param('id') id: string,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<void> {
    const shoppingSession = await this.shoppingSessionsService.findCurrentSessionForUser(decodedToken.email);

    if (!shoppingSession) {
      throw new ForbiddenException('No active shopping session found. Please login to start a new shopping session.');
    }

    await this.cartItemsService.remove(id, shoppingSession.id);
  }
}
