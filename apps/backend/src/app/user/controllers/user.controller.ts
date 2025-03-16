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

@Auth({ roles: ['realm:buy_products'] })
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @CustomPost({ path: 'me', res: UserResponse })
  async resolveCurrentUser(
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<UserResponse> {
    return await this.userService.resolveCurrentUser(decodedToken);
  }

  @CustomPut({ path: 'me/address', res: AddressResponse, body: UpdateUserAddressRequest })
  async updateCurrentUserAddress(
    @Body() request: UpdateUserAddressRequest,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<AddressResponse> {
    return await this.userService.updateCurrentUserAddress(decodedToken, request);
  }

  @CustomPatch({ path: 'me/phone', res: UserResponse, body: UpdateUserPhoneRequest })
  async updateCurrentUserPhone(
    @Body() request: UpdateUserPhoneRequest,
    @CustomHeaders('authorization', DecodeTokenPipe) decodedToken: DecodedToken
  ): Promise<UserResponse> {
    return await this.userService.updateCurrentUserPhone(decodedToken, request);
  }
}
