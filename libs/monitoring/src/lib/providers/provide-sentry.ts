import { APP_INITIALIZER, ErrorHandler, makeEnvironmentProviders } from '@angular/core';
import { Router } from '@angular/router';
import * as Sentry from '@sentry/angular';

export const provideSentry = () => {
  return makeEnvironmentProviders([
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
  ]);
};
