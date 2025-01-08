import { TestBed } from '@angular/core/testing';

import { MonitoringFacade } from './monitoring.facade';
import * as Sentry from '@sentry/angular';

jest.mock('@sentry/angular', () => ({
  setUser: jest.fn(),
}));

describe('MonitoringFacade', () => {
  let facade: MonitoringFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(MonitoringFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('setUser', () => {
    it('should set the user in sentryService', () => {
      facade.setUser({ id: 1 });

      expect(Sentry.setUser).toHaveBeenCalledWith({ id: 1, ip_address: 'none' });
    });

    it('should handle undefined', () => {
      facade.setUser({ id: undefined });

      expect(Sentry.setUser).toHaveBeenCalledWith({ id: undefined, ip_address: 'none' });
    });
  });
});
