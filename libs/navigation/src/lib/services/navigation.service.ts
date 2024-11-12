import { inject, Injectable } from '@angular/core';
import { PermissionService, PermissionStrategy } from '@demo-shop/auth';
import { FlyoutItem, NavigationItem, RouteItem } from '../models/navigation-item';
import { NavigationType } from '../enums/navigation-type';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  readonly #permissionService = inject(PermissionService);

  private readonly menuItems: NavigationItem[] = [
    new FlyoutItem('products', 101),
    new RouteItem('orders', 102, {
      route: 'orders',
      permissionStrategy: PermissionStrategy.AUTHENTICATED,
    }),
    new RouteItem('about', 103, {
      route: 'about',
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
