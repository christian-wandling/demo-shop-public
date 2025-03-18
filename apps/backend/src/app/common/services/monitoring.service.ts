import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { MonitoredUser } from '../models/monitored-user';

/**
 * Service responsible for handling application monitoring functionality.
 *
 * This service integrates with Sentry for error tracking and user monitoring,
 * providing methods to associate user information with monitoring data.
 */
@Injectable()
export class MonitoringService {
  /**
   * Associates a user with subsequent error reports and monitoring events.
   *
   * This method configures Sentry to track events in the context of the specified user.
   * It only performs this operation if Sentry is properly configured in the environment.
   * The user's IP address is explicitly set to 'none' for privacy considerations.
   *
   * @param user - The user to associate with monitoring data. Contains properties like id.
   */
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
