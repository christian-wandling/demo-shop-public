import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class NoReuseStrategy implements RouteReuseStrategy {
  shouldDetach(): boolean {
    return false;
  }

  store(): void {
    return;
  }

  shouldAttach(): boolean {
    return false;
  }

  retrieve(): DetachedRouteHandle | null {
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false;
  }
}
