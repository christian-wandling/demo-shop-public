import { InjectionToken } from '@angular/core';

export interface MonitoringConfig {
  sentry: {
    enabled: boolean;
    dsn: string;
    trustedDomain: string;
  };
}

export const MONITORING_CONFIG = new InjectionToken<MonitoringConfig>('MONITORING_CONFIG');
