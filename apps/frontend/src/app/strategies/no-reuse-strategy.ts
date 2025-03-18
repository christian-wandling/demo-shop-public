import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

/**
 * A route reuse strategy that prevents route reuse in Angular applications.
 * This strategy ensures that components are always recreated when navigating,
 * even when the route configuration remains the same.
 */
export class NoReuseStrategy implements RouteReuseStrategy {
  /**
   * Determines if the route should be detached and stored.
   * @returns {boolean} Always returns false to prevent detaching routes.
   */
  shouldDetach(): boolean {
    return false;
  }

  /**
   * Stores the detached route.
   * Empty implementation as routes are never detached.
   */
  store(): void {
    return;
  }

  /**
   * Determines if a stored route should be attached.
   * @returns {boolean} Always returns false as routes are never stored.
   */
  shouldAttach(): boolean {
    return false;
  }

  /**
   * Retrieves a stored route.
   * @returns {DetachedRouteHandle | null} Always returns null as routes are never stored.
   */
  retrieve(): DetachedRouteHandle | null {
    return null;
  }

  /**
   * Determines if the current route should be reused.
   * @returns {boolean} Always returns false to force recreation of routes
   */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false;
  }
}
