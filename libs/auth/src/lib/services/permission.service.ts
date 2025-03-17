import { inject, Injectable } from '@angular/core';
import { KeycloakService } from './keycloak.service';
import { PermissionStrategy } from '../enums/permission-strategy';

/**
 * Service handling user authorization
 */
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  readonly #keycloakService = inject(KeycloakService);

  /**
   * Dictionary of implemented permission strategies
   */
  readonly permissionStrategies: { [key in PermissionStrategy]: (...args: unknown[]) => boolean } = {
    [PermissionStrategy.AUTHENTICATED]: () => this.#keycloakService.authenticated,
  };

  /**
   * Returns result of permission check based based on available permissions strategies
   */
  hasPermission(permissionStrategy: PermissionStrategy, ...args: unknown[]): boolean {
    const permissionStrategyFn = this.permissionStrategies[permissionStrategy];

    if (!permissionStrategyFn) {
      return false;
    }

    return permissionStrategyFn.bind(this)();
  }
}
