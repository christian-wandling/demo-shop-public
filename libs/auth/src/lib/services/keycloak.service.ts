import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { AUTH_CONFIG } from '../models/auth-config';

/**
 * Service handling user authentication with keycloak
 */
@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  readonly authConfig = inject(AUTH_CONFIG);

  /**
   * Get access token for current user. Will return undefined if user is not authenticated
   */
  get token(): string | undefined {
    return this.keycloak.token;
  }

  /**
   * Check if user is currently authenticated
   */
  get authenticated(): boolean {
    return this.keycloak.authenticated === true;
  }

  private readonly keycloak: Keycloak = new Keycloak(this.authConfig.keycloak);

  /**
   * Initializes the Keycloak authentication service with silent redirect and checks for an existing session
   */
  async init(): Promise<boolean> {
    return await this.keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    });
  }

  /**
   * Initiates the login process for the user by redirecting to the keycloak server with a callback to the app
   */
  login(): Promise<void> {
    return this.keycloak.login();
  }

  /**
   * Initiates the logout process for the user by redirecting to the keycloak server with a callback to the app
   */
  logout(): Promise<void> {
    return this.keycloak.logout({ redirectUri: window.location.origin });
  }

  /**
   * Initiates the registration process for a new user by redirecting to the keycloak server with a callback to the app
   */
  register(): Promise<void> {
    return this.keycloak.register();
  }
}
