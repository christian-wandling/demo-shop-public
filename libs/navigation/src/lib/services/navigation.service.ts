import { inject, Injectable } from '@angular/core';
import { PermissionService, PermissionStrategy } from '@demo-shop/auth';
import { NavigationItem, RouteItem } from '../models/navigation-item';
import { NavigationType } from '../enums/navigation-type';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  readonly #permissionService = inject(PermissionService);

  private readonly menuItems: NavigationItem[] = [
    new RouteItem('products', 101, {
      route: 'products',
    }),
    new RouteItem('orders', 102, {
      route: 'orders',
      permissionStrategy: PermissionStrategy.AUTHENTICATED,
    }),
  ];

  getFilteredItems(type: NavigationType): NavigationItem[] {
    const isType = (itemType: NavigationType) => itemType === type;
    const allowDisplay = (strategy?: PermissionStrategy) =>
      !strategy || this.#permissionService.hasPermission(strategy);

    return this.menuItems
      .filter(item => isType(item.type) && allowDisplay(item.options?.['permissionStrategy']))
      .sort((a, b) => a.order - b.order);
  }
}
