import * as Sentry from '@sentry/angular';
import { environment } from './environments/environment';

if (environment.sentry.enabled) {
  Sentry.init({
    environment: environment.name,
    dsn: environment.sentry.dsn,
    integrations: [
      // Registers and configures the Tracing integration,
      // which automatically instruments your application to monitor its
      // performance, including custom Angular routing instrumentation
      Sentry.browserTracingIntegration(),
      // Registers the Replay integration,
      // which automatically captures Session Replays
      Sentry.replayIntegration(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    // We recommend adjusting this value in production
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: environment.production ? 0.5 : 1.0,

    // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
    tracePropagationTargets: ['localhost', 'https://demo-shop.wandling.dev'],

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: environment.production ? 0.2 : 1.0,
    beforeSend(event) {
      const isTrustedDomain = event.request?.url?.startsWith(environment?.sentry?.trustedDomain);
      const isNotHealthCheck = !event.request?.url?.includes('health-check');

      if (isTrustedDomain && isNotHealthCheck) {
        return event;
      } else {
        return null;
      }
    },
  });
}
