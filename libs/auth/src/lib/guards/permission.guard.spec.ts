import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { permissionGuard } from './permission.guard';
import { PermissionService } from '../services/permission.service';

describe('permissionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => permissionGuard(...guardParameters));

  let permissionService: PermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PermissionService,
          useValue: {
            hasPermission: jest.fn(),
          },
        },
      ],
    });

    permissionService = TestBed.inject(PermissionService);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if user is authenticated', () => {
    jest.spyOn(permissionService, 'hasPermission').mockReturnValue(true);

    expect(executeGuard({} as any, {} as any)).toBe(true);
  });

  it('should redirect to base path if user is not authenticated', () => {
    jest.spyOn(permissionService, 'hasPermission').mockReturnValue(false);
    const rootUrlTree = {
      fragment: null,
      queryParams: {},
      root: { children: {}, parent: null, segments: [] },
    };

    expect(executeGuard({} as any, {} as any)).toEqual(rootUrlTree);
  });
});
