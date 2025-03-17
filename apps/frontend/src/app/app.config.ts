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
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(appRoutes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideAnimationsAsync(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideRouterStore(),
    provideStore({
      router: routerReducer,
    }),
    {
      provide: RouteReuseStrategy,
      useClass: NoReuseStrategy,
    },
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => undefined,
      deps: [Sentry.TraceService],
      multi: true,
    },
    provideApi(withConfiguration({ basePath: '' })),
    provideAuth({ keycloak: environment.keycloak }),
    provideMonitoring({ sentry: environment.sentry }),
  ],
};
