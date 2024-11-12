import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { Routes } from '@angular/router';

export interface NavigationConfig {
  routes: Routes;
}

export const NAVIGATION_CONFIG = new InjectionToken<NavigationConfig>('NAVIGATION_CONFIG');


export const provideNavigation = (config: { routes: Routes }): EnvironmentProviders => {
  const routes = config.routes.filter(route => route.data?.['showInMenu']);

  return makeEnvironmentProviders([
    { provide: NAVIGATION_CONFIG, useValue: { routes } },
  ]);
};
