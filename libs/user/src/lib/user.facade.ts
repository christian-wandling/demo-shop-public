import { inject, Injectable, Signal } from '@angular/core';
import { UserStore } from './+state/user.store';
import { UpdateUserAddressRequest, UpdateUserPhoneRequest, UserResponse } from '@demo-shop/api';

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

  async updateUserAddress(address: UpdateUserAddressRequest): Promise<void> {
    await this.#userStore.updateUserAddress(address);
  }

  async updateUserPhone(phone: UpdateUserPhoneRequest): Promise<void> {
    await this.#userStore.updateUserPhone(phone);
  }
}
