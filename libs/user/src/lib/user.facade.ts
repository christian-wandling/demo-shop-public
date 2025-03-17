import { inject, Injectable, Signal } from '@angular/core';
import { UserStore } from './+state/user.store';
import { UpdateUserAddressRequest, UpdateUserPhoneRequest, UserResponse } from '@demo-shop/api';

/**
 * Facade service that provides an interface for user-related operations.
 * This service abstracts the underlying user store implementation and exposes
 * methods for retrieving and updating user information.
 */
@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  readonly #userStore = inject(UserStore);

  /**
   * Fetches the current user's information from the backend and puts it in the store
   */
  async fetchCurrentUser(): Promise<void> {
    await this.#userStore.fetchCurrentUser();
  }

  /**
   * Gets the current user information from the store
   */
  getCurrentUser(): Signal<UserResponse | undefined> {
    return this.#userStore.user;
  }

  /**
   * Updates the address information for the current user
   */
  async updateUserAddress(address: UpdateUserAddressRequest): Promise<void> {
    await this.#userStore.updateUserAddress(address);
  }

  /**
   * Updates the phone information for the current user
   */
  async updateUserPhone(phone: UpdateUserPhoneRequest): Promise<void> {
    await this.#userStore.updateUserPhone(phone);
  }
}
