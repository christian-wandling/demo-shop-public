import { Configuration, ConfigurationParameters } from '@demo-shop/api';
import { makeEnvironmentProviders } from '@angular/core';

export function withConfiguration(configurationParameters: ConfigurationParameters = {}): Configuration {
  return new Configuration({
    ...configurationParameters,
  });
}

export const provideApi = (config: Configuration = withConfiguration()) => {
  return makeEnvironmentProviders([{ provide: Configuration, useValue: config }]);
};
