import { InjectionToken } from '@angular/core';

export interface AuthConfig {
  keycloak: {
    url: string;
    realm: string;
    clientId: string;
  };
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');
