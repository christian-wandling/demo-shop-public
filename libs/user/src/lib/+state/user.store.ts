import { getState, patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { firstValueFrom } from 'rxjs';
import { effect, inject } from '@angular/core';
import { UserDTO, UsersApi } from '@demo-shop/api';
import { MonitoringFacade } from '@demo-shop/monitoring';

type UserState = {
  user: UserDTO | undefined;
};

const initialState: UserState = {
  user: undefined,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withDevtools('currentUser'),
  withMethods((store, usersApi = inject(UsersApi)) => ({
    async fetchCurrentUser(): Promise<void> {
      const user = await firstValueFrom(usersApi.getCurrentUser());
      patchState(store, state => ({ ...state, user }));
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
