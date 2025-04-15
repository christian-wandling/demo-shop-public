import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideApi, withConfiguration } from './providers/provide-api';
import { authInterceptor, provideAuth, createAuthInitializer } from '@demo-shop/auth';
import { environment } from '../environments/environment';
import { provideMonitoring, provideSentry } from '@demo-shop/monitoring';
import { provideImageLoader, provideRouteReuseStrategy } from '@demo-shop/shared';

export const appConfig: ApplicationConfig = {
  providers: [
    /** Performance optimization for change detection */
    provideZoneChangeDetection({ eventCoalescing: true }),

    /** HTTP client with fetch API and authentication interceptor */
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

    /** Router configuration with reload behavior on same URL navigation */
    provideRouter(appRoutes, withRouterConfig({ onSameUrlNavigation: 'reload' })),

    /** Async loading of animation capabilities */
    provideAnimationsAsync(),

    /** Redux DevTools configuration for state debugging */
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),

    /** Router state tracking integration */
    provideRouterStore(),

    /** NgRx store setup with router reducer */
    provideStore({ router: routerReducer }),

    /** Custom route reuse strategy to prevent component reuse */
    provideRouteReuseStrategy(),

    /** Sentry configuration **/
    provideSentry(),

    /** API client configuration with basePath: '' */
    provideApi(withConfiguration({ basePath: '' })),

    /** Provide Keycloak configuration to Auth lib */
    provideAuth({ keycloak: environment.keycloak }),

    /** Provide Sentry configuration to monitoring lib */
    provideMonitoring({ sentry: environment.sentry }),

    /** Image loader configuration **/
    provideImageLoader(),

    /** Create an initializer for keycloak **/
    createAuthInitializer(),
  ],
};
