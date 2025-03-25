import { ActivatedRouteSnapshot } from '@angular/router';
import { NoReuseStrategy } from './no-reuse-strategy'; // Adjust the import path as needed

describe('NoReuseStrategy', () => {
  let strategy: NoReuseStrategy;
  let mockFutureRoute: ActivatedRouteSnapshot;
  let mockCurrentRoute: ActivatedRouteSnapshot;

  beforeEach(() => {
    strategy = new NoReuseStrategy();

    // Create mock route snapshots
    mockFutureRoute = {} as ActivatedRouteSnapshot;
    mockCurrentRoute = {} as ActivatedRouteSnapshot;
  });

  describe('shouldDetach', () => {
    it('should always return false', () => {
      // Act
      const result = strategy.shouldDetach();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('store', () => {
    it('should not throw when called', () => {
      // Act & Assert
      expect(() => strategy.store()).not.toThrow();
    });
  });

  describe('shouldAttach', () => {
    it('should always return false', () => {
      // Act
      const result = strategy.shouldAttach();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('retrieve', () => {
    it('should always return null', () => {
      // Act
      const result = strategy.retrieve();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('shouldReuseRoute', () => {
    it('should always return false', () => {
      // Act
      const result = strategy.shouldReuseRoute(mockFutureRoute, mockCurrentRoute);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false regardless of route content', () => {
      // Arrange
      mockFutureRoute = {
        routeConfig: { path: 'test-path' },
      } as ActivatedRouteSnapshot;

      mockCurrentRoute = {
        routeConfig: { path: 'test-path' },
      } as ActivatedRouteSnapshot;

      // Act
      const result = strategy.shouldReuseRoute(mockFutureRoute, mockCurrentRoute);

      // Assert
      expect(result).toBe(false);
    });
  });
});
