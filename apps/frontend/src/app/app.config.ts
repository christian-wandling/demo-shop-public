import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router, RouteReuseStrategy, withRouterConfig } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideApi, withConfiguration } from './providers/provide-api';
import { authInterceptor, provideAuth } from '@demo-shop/auth';
import { environment } from '../environments/environment';
import * as Sentry from '@sentry/angular';
import { NoReuseStrategy } from './strategies/no-reuse-strategy';
import { provideMonitoring } from '@demo-shop/monitoring';

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
    provideStore({
      router: routerReducer,
    }),

    /** Custom route reuse strategy to prevent component reuse */
    {
      provide: RouteReuseStrategy,
      useClass: NoReuseStrategy,
    },

    /** Sentry error handler integration */
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    },

    /** Sentry performance tracing service */
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },

    /**  Initialize Sentry tracing on application startup */
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => undefined,
      deps: [Sentry.TraceService],
      multi: true,
    },

    /** API client configuration with basePath: '' */
    provideApi(withConfiguration({ basePath: '' })),

    /** Provide Keycloak configuration to Auth lib */
    provideAuth({ keycloak: environment.keycloak }),

    /** Provide Sentry configuration to monitoring lib */
    provideMonitoring({ sentry: environment.sentry }),
  ],
};
