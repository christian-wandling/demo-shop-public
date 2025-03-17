import { PermissionStrategy } from '@demo-shop/auth';
import { NavigationType } from '../enums/navigation-type';
import { RouteItem } from './route-item';

/**
 * Base abstract class representing a navigation item in the application
 */
export abstract class NavigationItem {
  /**
   * The type of navigation item
   */
  readonly type!: NavigationType;

  /**
   * Creates a new navigation item
   * @param {string} label - Display text for the navigation item
   * @param {number} order - Numeric value determining the display order of the item
   * @param {object} [options] - Optional configuration options
   * @param {PermissionStrategy} [options.permissionStrategy] - Strategy for determining user permissions for this item
   * @param {RouteItem[]} [subItems] - Child navigation items nested under this item
   */
  protected constructor(
    public label: string,
    public order: number,
    public options?: {
      permissionStrategy?: PermissionStrategy;
    },
    public subItems?: RouteItem[]
  ) {}
}
