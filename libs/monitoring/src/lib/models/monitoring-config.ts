import { InjectionToken } from '@angular/core';

/**
 * Configuration for application monitoring systems
 */
export interface MonitoringConfig {
  /**
   * Configuration settings for Sentry error tracking
   * @property {object} sentry - Sentry configuration object
   */
  sentry: {
    /**
     * Whether Sentry integration is enabled
     * @property {boolean} enabled - true to enable Sentry, false to disable
     */
    enabled: boolean;

    /**
     * Sentry Data Source Name (DSN)
     * @property {string} dsn - The URL string that identifies the Sentry project to send events to
     */
    dsn: string;

    /**
     * Trusted domain for Sentry
     * @property {string} trustedDomain - Domain that is considered safe for sending Sentry data
     */
    trustedDomain: string;
  };
}

export const MONITORING_CONFIG = new InjectionToken<MonitoringConfig>('MONITORING_CONFIG');
