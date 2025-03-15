import { makeEnvironmentProviders } from '@angular/core';
import { MONITORING_CONFIG, MonitoringConfig } from '../models/monitoring-config';

export const provideMonitoring = (config: MonitoringConfig) => {
  return makeEnvironmentProviders([{ provide: MONITORING_CONFIG, useValue: config }]);
};
