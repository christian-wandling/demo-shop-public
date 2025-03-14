import { PermissionStrategy } from '@demo-shop/auth';
import { NavigationType } from '../enums/navigation-type';

export abstract class NavigationItem {
  readonly type!: NavigationType;

  protected constructor(
    public label: string,
    public order: number,
    public options?: {
      permissionStrategy?: PermissionStrategy;
    },
    public subItems?: RouteItem[]
  ) {}
}

export class RouteItem extends NavigationItem {
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
