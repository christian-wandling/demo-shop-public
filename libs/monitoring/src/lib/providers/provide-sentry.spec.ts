import { makeEnvironmentProviders } from '@angular/core';
import { provideSentry } from './provide-sentry';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  makeEnvironmentProviders: jest.fn(),
}));

describe('Route Reuse Strategy Provider', () => {
  it('should create provider', () => {
    provideSentry();

    expect(makeEnvironmentProviders).toHaveBeenCalledTimes(1);
  });
});
