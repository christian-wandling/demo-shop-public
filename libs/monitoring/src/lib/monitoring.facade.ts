import { inject, Injectable } from '@angular/core';
import { MonitoredUser } from './models/monitored-user';
import * as Sentry from '@sentry/angular';
import { MONITORING_CONFIG } from './models/monitoring-config';

/**
 * Facade for monitoring aspects of the application
 */
@Injectable({
  providedIn: 'root',
})
export class MonitoringFacade {
  readonly config = inject(MONITORING_CONFIG);

  /**
   * Sets the current user privacy compliant information for monitoring purposes
   * IP address tracking is explicitly disabled for privacy.
   */
  setUser(user: MonitoredUser): void {
    const { enabled, dsn } = this.config.sentry;

    if (!enabled || !dsn) {
      return;
    }

    Sentry.setUser({
      ...user,
      ip_address: 'none', // do not track ip address
    });
  }
}
