import { Body, Controller, NotFoundException, Param } from '@nestjs/common';
import { CartItemService } from '../services/cart-item.service';
import { CartItemResponse } from '../dtos/cart-item-response';
import { CustomPost } from '../../common/decorators/custom-post.decorator';
import { Auth } from '../../common/decorators/auth.decorator';
import { CustomHeaders } from '../../common/decorators/custom-headers.decorator';
import { DecodeTokenPipe } from '../../common/pipes/decode-token-pipe';
import { ShoppingSessionService } from '../../shopping-session/services/shopping-session.service';
import { CustomDelete } from '../../common/decorators/custom-delete.decorator';
import { CustomPatch } from '../../common/decorators/custom-patch.decorator';
import { DecodedToken } from '../../common/models/decoded-token';
import { UpdateCartItemQuantityRequest } from '../dtos/update-cart-item-quantity-request';
import { AddCartItemRequest } from '../dtos/add-cart-item-request';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Controller for managing cart items within a shopping session.
 * Requires 'realm:buy_products' role for authorization.
 */
@Auth({ roles: ['realm:buy_products'] })
@ApiTags('shopping-session')
@Controller({ path: 'shopping-sessions', version: '1' })
export class CartItemController {
  constructor(
    private readonly shoppingSessionService: ShoppingSessionService,
    private readonly cartItemService: CartItemService
  ) {}

  /**
   * Adds a new item to the current user's shopping cart.
   * Endpoint: POST /v1/shopping-sessions/current/cart-items
   * @param dto The cart item details to add
   * @param decodedToken The decoded authentication token containing user information
   * @returns The newly created cart item
   * @throws NotFoundException when no active shopping session is found for the user
   */
  @ApiOperation({
    summary: 'Add cart item',
    description:
      'Add a cart item to the shopping session of current user based on identity extracted from bearer token',
    operationId: 'AddCartItem',
  })
  @CustomPost({ path: '/current/cart-items', body: AddCartItemRequest, res: CartItemResponse })
  async addCartItem(
    @Body() dto: AddCartItemRequest,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<CartItemResponse> {
    const shoppingSession = await this.shoppingSessionService.findCurrentSessionForUser(decodedToken.sub);

    if (!shoppingSession) {
      throw new NotFoundException('No active shopping session found. Please login to start a new shopping session.');
    }

    return this.cartItemService.create(dto, shoppingSession.id);
  }

  /**
   * Updates the quantity of an item in the current user's shopping cart.
   * Endpoint: PATCH /v1/shopping-sessions/current/cart-items/:id
   * @param id The ID of the cart item to update
   * @param dto The new quantity information
   * @param decodedToken The decoded authentication token containing user information
   * @returns The updated cart item
   * @throws NotFoundException when no active shopping session is found for the user
   */
  @ApiOperation({
    summary: 'Update cart item quantity',
    description:
      'Update quantity of a cart item in shopping session of current user based on identity extracted from bearer token',
    operationId: 'UpdateCartItemQuantity',
  })
  @CustomPatch({ path: '/current/cart-items/:id', body: UpdateCartItemQuantityRequest, res: CartItemResponse })
  async updateCartItemQuantity(
    @Param('id') id: number,
    @Body() dto: UpdateCartItemQuantityRequest,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<CartItemResponse> {
    const shoppingSession = await this.shoppingSessionService.findCurrentSessionForUser(decodedToken.sub);

    if (!shoppingSession) {
      throw new NotFoundException('No active shopping session found. Please login to start a new shopping session.');
    }

    return this.cartItemService.update(Number(id), dto, shoppingSession.id);
  }

  /**
   * Removes an item from the current user's shopping cart.
   * Endpoint: DELETE /v1/shopping-sessions/current/cart-items/:id
   * @param id The ID of the cart item to remove
   * @param decodedToken The decoded authentication token containing user information
   * @throws NotFoundException when no active shopping session is found for the user
   */
  @ApiOperation({
    summary: 'Remove cart item',
    description:
      'Remove a cart item from the shopping session of current user based on identity extracted from bearer token',
    operationId: 'RemoveCartItem',
  })
  @CustomDelete({ path: '/current/cart-items/:id' })
  async removeCartItem(
    @Param('id') id: number,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<void> {
    const shoppingSession = await this.shoppingSessionService.findCurrentSessionForUser(decodedToken.sub);

    if (!shoppingSession) {
      throw new NotFoundException('No active shopping session found. Please login to start a new shopping session.');
    }

    await this.cartItemService.remove(Number(id), shoppingSession.id);
  }
}
