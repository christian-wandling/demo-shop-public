import { InjectionToken } from '@angular/core';

/**
 * Configuration for authentication services
 */
export interface AuthConfig {
  /**
   * Configuration settings for Keycloak authentication
   * @property {object} keycloak - Keycloak configuration object
   */
  keycloak: {
    /**
     * Base URL of the Keycloak server
     * @property {string} url - The URL where the Keycloak server is hosted
     */
    url: string;

    /**
     * Keycloak realm name
     * @property {string} realm - The realm in Keycloak that contains the application's configuration
     */
    realm: string;

    /**
     * Client identifier for the application
     * @property {string} clientId - The ID that identifies this application in Keycloak
     */
    clientId: string;
  };
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');
