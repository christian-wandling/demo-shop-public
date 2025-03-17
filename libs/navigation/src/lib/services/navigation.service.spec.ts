import { TestBed } from '@angular/core/testing';
import { AuthFacade, PermissionStrategy } from '@demo-shop/auth';
import { NavigationService } from './navigation.service';
import { NavigationType } from '../enums/navigation-type';

import { RouteItem } from '../models/route-item';

describe('NavigationService', () => {
  let service: NavigationService;
  let authFacade: jest.Mocked<AuthFacade>;

  beforeEach(() => {
    const authFacadeMock = {
      hasPermission: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [NavigationService, { provide: AuthFacade, useValue: authFacadeMock }],
    });

    service = TestBed.inject(NavigationService);
    authFacade = TestBed.inject(AuthFacade) as jest.Mocked<AuthFacade>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFilteredItems', () => {
    it('should return items of specified type when user has permission', () => {
      authFacade.hasPermission.mockReturnValue(true);

      const items = service.getFilteredItems(NavigationType.ROUTE);

      expect(items.length).toBe(2);
      expect(items[0]).toBeInstanceOf(RouteItem);
      expect(items[0].order).toBe(101);
      expect(items[1].order).toBe(102);
    });

    it('should filter out items requiring permission when user lacks permission', () => {
      authFacade.hasPermission.mockReturnValue(false);

      const items = service.getFilteredItems(NavigationType.ROUTE);

      expect(items.length).toBe(1);
      expect(items[0]).toBeInstanceOf(RouteItem);
      expect(items[0].order).toBe(101);
    });

    it('should return items sorted by order', () => {
      authFacade.hasPermission.mockReturnValue(true);

      const items = service.getFilteredItems(NavigationType.ROUTE);

      expect(items.map(item => item.order)).toEqual([101, 102]);
    });

    it('should include items without permission strategy regardless of permission service response', () => {
      authFacade.hasPermission.mockReturnValue(false);

      const items = service.getFilteredItems(NavigationType.ROUTE) as RouteItem[];

      expect(items.length).toBe(1);
      expect(items[0].options?.['route']).toBe('products');
    });

    it('should check permission service with correct strategy', () => {
      authFacade.hasPermission.mockReturnValue(true);

      service.getFilteredItems(NavigationType.ROUTE);

      expect(authFacade.hasPermission).toHaveBeenCalledWith(PermissionStrategy.AUTHENTICATED);
    });
  });
});
