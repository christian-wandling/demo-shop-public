import { getState, patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { firstValueFrom } from 'rxjs';
import { effect, inject } from '@angular/core';
import { UpdateUserAddressRequest, UpdateUserPhoneRequest, UserApi, UserResponse } from '@demo-shop/api';
import { MonitoringFacade } from '@demo-shop/monitoring';

type UserState = {
  user: UserResponse | undefined;
};

const initialState: UserState = {
  user: undefined,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withDevtools('currentUser'),
  withMethods((store, userApi = inject(UserApi)) => ({
    async fetchCurrentUser(): Promise<void> {
      const user = await firstValueFrom(userApi.resolveCurrentUser());
      patchState(store, state => ({ ...state, user }));
    },
    async updateUserAddress(update: UpdateUserAddressRequest): Promise<void> {
      const address = await firstValueFrom(userApi.updateCurrentUserAddress(update));

      patchState(store, state => {
        if (!state.user) {
          throw new Error('User not found');
        }

        return { ...state, user: { ...state.user, address } };
      });
    },
    async updateUserPhone(update: UpdateUserPhoneRequest): Promise<void> {
      const res = await firstValueFrom(userApi.updateCurrentUserPhone(update));

      patchState(store, state => {
        if (!state.user) {
          throw new Error('User not found');
        }

        return { ...state, user: { ...state.user, phone: res.phone } };
      });
    },
  })),
  withHooks({
    onInit(store) {
      const monitoringFacade = inject(MonitoringFacade);

      effect(() => {
        const { user } = getState(store);
        monitoringFacade.setUser({ id: user?.id });
      });
    },
  })
);
