import { TestBed } from '@angular/core/testing';
import { PermissionService, PermissionStrategy } from '@demo-shop/auth';
import { NavigationService } from './navigation.service';
import { NavigationType } from '../enums/navigation-type';
import { RouteItem } from '../models/navigation-item';

describe('NavigationService', () => {
  let service: NavigationService;
  let permissionService: jest.Mocked<PermissionService>;

  beforeEach(() => {
    const permissionServiceMock = {
      hasPermission: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [NavigationService, { provide: PermissionService, useValue: permissionServiceMock }],
    });

    service = TestBed.inject(NavigationService);
    permissionService = TestBed.inject(PermissionService) as jest.Mocked<PermissionService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFilteredItems', () => {
    it('should return items of specified type when user has permission', () => {
      permissionService.hasPermission.mockReturnValue(true);

      const items = service.getFilteredItems(NavigationType.ROUTE);

      expect(items.length).toBe(2);
      expect(items[0]).toBeInstanceOf(RouteItem);
      expect(items[0].order).toBe(101);
      expect(items[1].order).toBe(102);
    });

    it('should filter out items requiring permission when user lacks permission', () => {
      permissionService.hasPermission.mockReturnValue(false);

      const items = service.getFilteredItems(NavigationType.ROUTE);

      expect(items.length).toBe(1);
      expect(items[0]).toBeInstanceOf(RouteItem);
      expect(items[0].order).toBe(101);
    });

    it('should return items sorted by order', () => {
      permissionService.hasPermission.mockReturnValue(true);

      const items = service.getFilteredItems(NavigationType.ROUTE);

      expect(items.map(item => item.order)).toEqual([101, 102]);
    });

    it('should include items without permission strategy regardless of permission service response', () => {
      permissionService.hasPermission.mockReturnValue(false);

      const items = service.getFilteredItems(NavigationType.ROUTE) as RouteItem[];

      expect(items.length).toBe(1);
      expect(items[0].options?.['route']).toBe('products');
    });

    it('should check permission service with correct strategy', () => {
      permissionService.hasPermission.mockReturnValue(true);

      service.getFilteredItems(NavigationType.ROUTE);

      expect(permissionService.hasPermission).toHaveBeenCalledWith(PermissionStrategy.AUTHENTICATED);
    });
  });
});
