import { inject, Injectable, Signal } from '@angular/core';
import { UserStore } from './+state/user.store';
import { UserResponse } from '@demo-shop/api';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  readonly #userStore = inject(UserStore);

  async fetchCurrentUser(): Promise<void> {
    await this.#userStore.fetchCurrentUser();
  }

  getCurrentUser(): Signal<UserResponse | undefined> {
    return this.#userStore.user;
  }
}
