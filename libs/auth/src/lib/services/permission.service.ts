import { inject, Injectable } from '@angular/core';
import { KeycloakService } from './keycloak.service';
import { PermissionStrategy } from '../enums/permission-strategy';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  readonly #keycloakService = inject(KeycloakService);
  readonly permissionStrategies: { [key in PermissionStrategy]: (...args: unknown[]) => boolean } = {
    [PermissionStrategy.AUTHENTICATED]: () => this.#keycloakService.authenticated,
  };

  hasPermission(permissionStrategy: PermissionStrategy, ...args: unknown[]): boolean {
    const permissionStrategyFn = this.permissionStrategies[permissionStrategy];

    if (!permissionStrategyFn) {
      return false;
    }

    return permissionStrategyFn.bind(this)();
  }
}
