import { makeEnvironmentProviders } from '@angular/core';
import { AUTH_CONFIG, AuthConfig } from '../models/auth-config';

export const provideAuth = (config: AuthConfig) => {
  return makeEnvironmentProviders([{ provide: AUTH_CONFIG, useValue: config }]);
};
