import { inject, Injectable, Signal } from '@angular/core';
import { UserStore } from './+state/user.store';
import { UserDTO } from '@demo-shop/api';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  readonly #userStore = inject(UserStore);

  async fetchCurrentUser(): Promise<void> {
    await this.#userStore.fetchCurrentUser();
  }

  getCurrentUser(): Signal<UserDTO | undefined> {
    return this.#userStore.user;
  }
}
