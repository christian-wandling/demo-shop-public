import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const isProd = process.env.NODE_ENV === 'production';

// Before Sentry.init
console.log('Sentry initialization debug:', {
  NODE_ENV: process.env.NODE_ENV,
  DSN: process.env.SENTRY_DEMO_SHOP_API_DSN?.substring(0, 10) + '...', // truncated for security
  integrations: [nodeProfilingIntegration(), Sentry.prismaIntegration()].map(i => i.name),
});

Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: process.env.SENTRY_DEMO_SHOP_API_DSN,
  integrations: [nodeProfilingIntegration(), Sentry.prismaIntegration()],
  tracesSampleRate: isProd ? 0.5 : 1.0, //  Capture 100% of the transactions
  beforeSend(event) {
    const isNotHealthCheck = !event.request?.url?.includes('health-check');

    if (event.request?.data) {
      delete event.request.data.password;
    }

    if (isNotHealthCheck) {
      return event;
    } else {
      return null;
    }
  },
});

// After Sentry.init
console.log('Sentry config:', Sentry.getCurrentHub().getClient()?.getOptions());

Sentry.captureException(new Error('Sentry test error'));
