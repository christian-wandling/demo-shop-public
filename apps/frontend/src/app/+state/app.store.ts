import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { AuthFacade } from '@demo-shop/auth';
import { CartFacade } from '@demo-shop/cart';
import { UserFacade } from '@demo-shop/user';

/**
 * Represents the state of the application's initialization status.
 */
type AppState = {
  /** Indicates whether the application has completed initialization */
  initialized: boolean;
};

/**
 * Initial application state with initialization set to false.
 */
const initialState: AppState = {
  initialized: false,
};

/**
 * Central application store responsible for coordinating app initialization.
 *
 * This store manages the initialization process including:
 * - Authentication session verification
 * - User data fetching
 * - Shopping cart session loading
 *
 * The store automatically triggers initialization when created through the onInit hook.
 */
export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, authFacade = inject(AuthFacade), cartFacade = inject(CartFacade), userFacade = inject(UserFacade)) => ({
      /**
       * Initializes the application by performing the following sequence:
       * 1. Verifies if there's an active authentication session
       * 2. If authenticated, fetches the current user profile
       * 3. If authenticated, loads the user's shopping cart session
       * 4. Updates the app's initialization state to complete
       *
       * @returns A promise that resolves when initialization is complete
       */
      async init(): Promise<void> {
        const hasActiveSession = authFacade.isAuthenticated();

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
