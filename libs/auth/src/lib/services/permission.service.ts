import { inject, Injectable } from '@angular/core';
import { KeycloakService } from './keycloak.service';
import { PermissionStrategy } from '../enums/permission-strategy';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  readonly permissionStrategies: { [key in PermissionStrategy]: (...args: unknown[]) => boolean } = {
    [PermissionStrategy.AUTHENTICATED]: this.isAuthenticated,
  };
  readonly #keycloakService = inject(KeycloakService);

  hasPermission(permissionStrategy: PermissionStrategy, ...args: unknown[]): boolean {
    const permissionStrategyFn = this.permissionStrategies[permissionStrategy];

    if (!permissionStrategyFn) {
      return false;
    }

    return permissionStrategyFn.bind(this)();
  }

  isAuthenticated(): boolean {
    return this.#keycloakService.authenticated;
  }
}
