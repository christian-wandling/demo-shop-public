import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { PermissionStrategy } from '../enums/permission-strategy';

export const permissionGuard: CanActivateFn = (route, state) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  if (permissionService.hasPermission(PermissionStrategy.AUTHENTICATED)) {
    return true;
  }

  return router.createUrlTree(['/']);
};
