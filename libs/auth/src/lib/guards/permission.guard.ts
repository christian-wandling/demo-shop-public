import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { PermissionStrategy } from '../enums/permission-strategy';

export const permissionGuard: CanActivateFn = (route, state) => {
  const permissionService = inject(PermissionService);

  return permissionService.hasPermission(PermissionStrategy.AUTHENTICATED);
};
