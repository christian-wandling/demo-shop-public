import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { MonitoredUser } from '../models/monitored-user';

@Injectable()
export class MonitoringService {
  setUser(user: MonitoredUser): void {
    const isSentryConfigured =
      !!process.env.SENTRY_AUTH_TOKEN &&
      !!process.env.SENTRY_ORG &&
      !!process.env.SENTRY_DEMO_SHOP_API_PROJECT &&
      !!process.env.SENTRY_DEMO_SHOP_API_DSN;

    if (!isSentryConfigured) {
      return;
    }

    Sentry.setUser({
      ...user,
      ip_address: 'none',
    });
  }
}
