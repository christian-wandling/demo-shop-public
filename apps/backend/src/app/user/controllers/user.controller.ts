import { UserService } from '../services/user.service';
import { UserResponse } from '../dtos/user-response';
import { CustomHeaders } from '../../common/decorators/custom-headers.decorator';
import { DecodeTokenPipe } from '../../common/pipes/decode-token-pipe';
import { Auth } from '../../common/decorators/auth.decorator';
import { DecodedToken } from '../../common/models/decoded-token';
import { CustomPost } from '../../common/decorators/custom-post.decorator';
import { CustomPut } from '../../common/decorators/custom-put.decorator';
import { UpdateUserAddressRequest } from '../dtos/update-user-address-request';
import { Body, Controller } from '@nestjs/common';
import { CustomPatch } from '../../common/decorators/custom-patch.decorator';
import { AddressResponse } from '../dtos/address-response';
import { UpdateUserPhoneRequest } from '../dtos/update-user-phone-request';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Controller handling user-related endpoints for authenticated users.
 * Requires 'realm:buy_products' role for access.
 */
@Auth({ roles: ['realm:buy_products'] })
@ApiTags('user')
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Retrieves information about the currently authenticated user.
   * @param decodedToken The decoded JWT token containing user information
   * @returns Promise containing the current user's data
   */
  @ApiOperation({
    summary: 'Resolve current user',
    description: 'Resolve current user based on identity extracted from bearer token',
    operationId: 'ResolveCurrentUser',
  })
  @CustomPost({ path: 'me', res: UserResponse })
  async resolveCurrentUser(
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<UserResponse> {
    return await this.userService.resolveCurrentUser(decodedToken);
  }

  /**
   * Updates the address information for the currently authenticated user.
   * @param request The request containing the new address information
   * @param decodedToken The decoded JWT token containing user information
   * @returns Promise containing the updated address information
   */
  @ApiOperation({
    summary: 'Update address of current user',
    description: 'Update the address of the user based on identity extracted from bearer token',
    operationId: 'UpdateCurrentUserAddress',
  })
  @CustomPut({ path: 'me/address', res: AddressResponse, body: UpdateUserAddressRequest })
  async updateCurrentUserAddress(
    @Body() request: UpdateUserAddressRequest,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<AddressResponse> {
    return await this.userService.updateCurrentUserAddress(decodedToken, request);
  }

  /**
   * Updates the phone number for the currently authenticated user.
   * @param request The request containing the new phone number
   * @param decodedToken The decoded JWT token containing user information
   * @returns Promise containing the updated user information
   */
  @ApiOperation({
    summary: 'Update phone of current user',
    description: 'Update the phone of the user based on identity extracted from bearer token',
    operationId: 'UpdateCurrentUserPhone',
  })
  @CustomPatch({ path: 'me/phone', res: UserResponse, body: UpdateUserPhoneRequest })
  async updateCurrentUserPhone(
    @Body() request: UpdateUserPhoneRequest,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<UserResponse> {
    return await this.userService.updateCurrentUserPhone(decodedToken, request);
  }
}
