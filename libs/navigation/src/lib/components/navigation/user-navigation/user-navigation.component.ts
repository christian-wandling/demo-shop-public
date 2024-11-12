import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFacade } from '@demo-shop/auth';
import { UserFacade } from '@demo-shop/user';
import { CartFacade } from '@demo-shop/cart';

@Component({
  selector: 'lib-user-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-navigation.component.html',
  styleUrl: './user-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNavigationComponent {
  readonly isSmallScreen = input(false, { transform: booleanAttribute });

  readonly #authFacade = inject(AuthFacade);
  readonly #userFacade = inject(UserFacade);
  readonly currentUser = this.#userFacade.getCurrentUser();
  readonly #cartFacade = inject(CartFacade);

  async login(): Promise<void> {
    await this.#authFacade.login();
    await this.#cartFacade.loadShoppingSession();
  }

  async register(): Promise<void> {
    await this.#authFacade.register();
    await this.#cartFacade.loadShoppingSession();
  }

  async logout(): Promise<void> {
    await this.#authFacade.logout();
  }
}