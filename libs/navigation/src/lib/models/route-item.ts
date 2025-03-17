import { NavigationType } from '../enums/navigation-type';
import { PermissionStrategy } from '@demo-shop/auth';
import { NavigationItem } from './navigation-item';

/**
 * Represents a navigation item that links to an Angular route
 */
export class RouteItem extends NavigationItem {
  /**
   * The type of navigation item, always set to ROUTE for RouteItem
   */
  override readonly type: NavigationType = NavigationType.ROUTE;

  constructor(
    label: string,
    order: number,
    public override options: {
      route: string;
      permissionStrategy?: PermissionStrategy;
      query?: string;
    },
    subItems?: RouteItem[]
  ) {
    super(label, order, options, subItems);
  }
}
