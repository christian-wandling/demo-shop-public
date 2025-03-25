import { makeEnvironmentProviders } from '@angular/core';
import { provideRouteReuseStrategy } from './provide-route-reuse-strategy';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  makeEnvironmentProviders: jest.fn(),
}));

describe('Route Reuse Strategy Provider', () => {
  it('should create provider', () => {
    provideRouteReuseStrategy();

    expect(makeEnvironmentProviders).toHaveBeenCalledTimes(1);
  });
});
