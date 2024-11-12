import { Param } from '@nestjs/common';
import { ShoppingSessionsService } from './services/shopping-sessions.service';
import { ShoppingSessionDTO } from './dtos/shopping-session-dto';
import { Auth } from '../common/decorators/auth.decorator';
import { CustomController } from '../common/decorators/custom-controller.decorator';
import { CustomPost } from '../common/decorators/custom-post.decorator';
import { CustomGet } from '../common/decorators/custom-get.decorator';
import { CustomHeaders } from '../common/decorators/custom-headers.decorator';
import { EmailFromTokenPipe } from '../common/pipes/email-from-token.pipe';
import { CustomDelete } from '../common/decorators/custom-delete.decorator';

@CustomController({ path: 'shopping-sessions', version: '1' })
@Auth({ roles: ['buy_products'] })
export class ShoppingSessionsController {
  constructor(private readonly shoppingSessionsService: ShoppingSessionsService) {}

  @CustomPost({ body: undefined, res: ShoppingSessionDTO })
  async createShoppingSession(
    @CustomHeaders('authorization', EmailFromTokenPipe) email: string
  ): Promise<ShoppingSessionDTO> {
    return this.shoppingSessionsService.create(email);
  }

  @CustomGet({ path: 'current', res: ShoppingSessionDTO })
  async getShoppingSessionOfCurrentUser(
    @CustomHeaders('authorization', EmailFromTokenPipe) email: string
  ): Promise<ShoppingSessionDTO> {
    return this.shoppingSessionsService.findCurrentSessionForUser(email);
  }

  @CustomDelete({ path: ':id' })
  async removeShoppingSession(
    @Param('id') id: string,
    @CustomHeaders('authorization', EmailFromTokenPipe) email: string
  ): Promise<void> {
    await this.shoppingSessionsService.remove(id, email);
  }
}
