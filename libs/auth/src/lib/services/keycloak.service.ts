import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { AUTH_CONFIG } from '../models/auth-config';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  readonly authConfig = inject(AUTH_CONFIG);

  get token(): string | undefined {
    return this.keycloak.token;
  }

  get authenticated(): boolean {
    return this.keycloak.authenticated === true;
  }

  private readonly keycloak: Keycloak = new Keycloak(this.authConfig.keycloak);

  async init(): Promise<boolean> {
    return await this.keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    });
  }

  login(): Promise<void> {
    return this.keycloak.login();
  }

  logout(): Promise<void> {
    return this.keycloak.logout({ redirectUri: window.location.origin });
  }

  register(): Promise<void> {
    return this.keycloak.register();
  }
}
