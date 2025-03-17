import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { AuthFacade } from '@demo-shop/auth';
import { CartFacade } from '@demo-shop/cart';
import { UserFacade } from '@demo-shop/user';

type AppState = {
  initialized: boolean;
};

const initialState: AppState = {
  initialized: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, authFacade = inject(AuthFacade), cartFacade = inject(CartFacade), userFacade = inject(UserFacade)) => ({
      async init(): Promise<void> {
        const hasActiveSession = await authFacade.initializeAuth();

        if (hasActiveSession) {
          await userFacade.fetchCurrentUser();
          await cartFacade.loadShoppingSession();
        }

        patchState(store, state => ({ ...state, initialized: true }));
      },
    })
  ),
  withHooks({
    onInit({ init }) {
      init();
    },
  })
);
