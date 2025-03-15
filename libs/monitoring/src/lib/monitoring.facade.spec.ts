import { TestBed } from '@angular/core/testing';

import { MonitoringFacade } from './monitoring.facade';
import * as Sentry from '@sentry/angular';
import { MONITORING_CONFIG, MonitoringConfig } from './models/monitoring-config';

jest.mock('@sentry/angular', () => ({
  setUser: jest.fn(),
}));

describe('MonitoringFacade', () => {
  let facade: MonitoringFacade;
  let config: MonitoringConfig;

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MONITORING_CONFIG,
          useValue: {
            sentry: {
              enabled: true,
              dsn: 'dsn',
              trustedDomain: 'trustedDomain',
            },
          },
        },
      ],
    });
    facade = TestBed.inject(MonitoringFacade);
    config = TestBed.inject(MONITORING_CONFIG);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('setUser', () => {
    it('should set the user', () => {
      facade.setUser({ id: 1 });

      expect(Sentry.setUser).toHaveBeenCalledWith({ id: 1, ip_address: 'none' });
    });

    it('should not set the user if sentry not configured', () => {
      config.sentry = { enabled: false, dsn: '', trustedDomain: '' };
      facade.setUser({ id: 1 });

      expect(Sentry.setUser).not.toHaveBeenCalled();
    });

    it('should handle undefined', () => {
      facade.setUser({ id: undefined });

      expect(Sentry.setUser).toHaveBeenCalledWith({ id: undefined, ip_address: 'none' });
    });
  });
});
