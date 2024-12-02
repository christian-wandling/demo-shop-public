import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { provideNavigation } from '@demo-shop/navigation';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideApi, withConfiguration } from './providers/provide-api';
import { authInterceptor, provideAuth } from '@demo-shop/auth';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]),
      withXsrfConfiguration({
        cookieName: '__Host-psifi.x-csrf-token',
        headerName: 'x-csrf-token',
      })
    ),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideNavigation({ routes: appRoutes }),
    provideStore({
      router: routerReducer,
    }),
    provideRouterStore(),
    provideApi(
      withConfiguration({
        basePath: '/api',
      })
    ),
    provideAuth({
      keycloak: environment.keycloak,
    }),
  ],
};
