import { makeEnvironmentProviders } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { NoReuseStrategy } from '../strategies/no-reuse-strategy';

export const provideRouteReuseStrategy = () => {
  return makeEnvironmentProviders([
    {
      provide: RouteReuseStrategy,
      useClass: NoReuseStrategy,
    },
  ]);
};
