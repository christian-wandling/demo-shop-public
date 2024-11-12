import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { firstValueFrom } from 'rxjs';
import { inject } from '@angular/core';
import { UserDTO, UsersApi } from '@demo-shop/api';

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
  }))
);
