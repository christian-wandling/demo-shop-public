import { makeEnvironmentProviders } from '@angular/core';
import { provideMonitoring } from './provide-monitoring';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  makeEnvironmentProviders: jest.fn(),
}));

describe('Route Reuse Strategy Provider', () => {
  it('should create provider', () => {
    provideMonitoring({ sentry: { dsn: 'dsn', enabled: true, trustedDomain: 'trustedDomain' } });

    expect(makeEnvironmentProviders).toHaveBeenCalledTimes(1);
  });
});
