import { inject, Injectable } from '@angular/core';
import { AuthFacade, PermissionStrategy } from '@demo-shop/auth';
import { NavigationItem } from '../models/navigation-item';
import { NavigationType } from '../enums/navigation-type';
import { RouteItem } from '../models/route-item';

/**
 * Service responsible for managing application navigation items
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  readonly #authFacade = inject(AuthFacade);

  /**
   * Collection of all available navigation items in the application
   */
  private readonly menuItems: NavigationItem[] = [
    new RouteItem('products', 101, {
      route: 'products',
    }),
    new RouteItem('orders', 102, {
      route: 'orders',
      permissionStrategy: PermissionStrategy.AUTHENTICATED,
    }),
  ];

  /**
   * Returns navigation items filtered by type and user permissions
   *
   * This method filters the navigation items based on:
   * 1. The specified navigation type
   * 2. The user's permissions (if a permission strategy is defined)
   * The resulting items are sorted by their order property in ascending order.
   */
  getFilteredItems(type: NavigationType): NavigationItem[] {
    const isType = (itemType: NavigationType) => itemType === type;
    const allowDisplay = (strategy?: PermissionStrategy) => !strategy || this.#authFacade.hasPermission(strategy);

    return this.menuItems
      .filter(item => isType(item.type) && allowDisplay(item.options?.['permissionStrategy']))
      .sort((a, b) => a.order - b.order);
  }
}
