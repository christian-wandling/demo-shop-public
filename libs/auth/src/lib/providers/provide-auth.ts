import { makeEnvironmentProviders } from '@angular/core';
import { AUTH_CONFIG, AuthConfig } from '../models/auth-config';

/**
 * Provider to allow a config to be injected in the Auth lib
 */
export const provideAuth = (config: AuthConfig) => {
  return makeEnvironmentProviders([{ provide: AUTH_CONFIG, useValue: config }]);
};
