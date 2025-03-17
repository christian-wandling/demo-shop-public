import { inject, Injectable } from '@angular/core';
import { KeycloakService } from './services/keycloak.service';
import { PermissionStrategy } from './enums/permission-strategy';
import { PermissionService } from './services/permission.service';

/**
 * Facade service that provides authentication and authorization functionalities.
 * This service abstracts the underlying Keycloak and permission services and exposes
 * methods for user authentication, authorization, and permission checking.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  readonly #keycloakService = inject(KeycloakService);
  readonly #permissionService = inject(PermissionService);

  /**
   * Initializes the Keycloak authentication service and checks for an existing session
   */
  async initializeAuth(): Promise<boolean> {
    return await this.#keycloakService.init();
  }

  /**
   * Initiates the login process
   */
  async login(): Promise<void> {
    await this.#keycloakService.login();
  }

  /**
   * Initiates the logout process
   */
  async logout(): Promise<void> {
    await this.#keycloakService.logout();
  }

  /**
   * Initiates the registration process
   */
  async register(): Promise<void> {
    await this.#keycloakService.register();
  }

  /**
   * Checks if the user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.#keycloakService.authenticated;
  }

  /**
   * Checks if the user has the permission based on the provided strategy
   */
  hasPermission(permissionStrategy: PermissionStrategy, ...args: unknown[]): boolean {
    return this.#permissionService.hasPermission(permissionStrategy, ...args);
  }

  /**
   * Retrieves the current access token
   */
  getToken(): string | undefined {
    return this.#keycloakService.token;
  }
}
