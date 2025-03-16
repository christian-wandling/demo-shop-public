import { TestBed } from '@angular/core/testing';

import { PermissionService } from './permission.service';
import { KeycloakService } from './keycloak.service';
import { PermissionStrategy } from '../enums/permission-strategy';

describe('PermissionService', () => {
  let service: PermissionService;
  let keycloakService: KeycloakService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: KeycloakService,
          useValue: {
            get authenticated() {
              return true;
            },
          },
        },
      ],
    });

    keycloakService = TestBed.inject(KeycloakService);
    service = TestBed.inject(PermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if user has permission', () => {
    expect(service.hasPermission(PermissionStrategy.AUTHENTICATED)).toBe(true);
  });

  it('should return false if user not has permission', () => {
    jest.spyOn(keycloakService, 'authenticated', 'get').mockReturnValue(false);

    expect(service.hasPermission(PermissionStrategy.AUTHENTICATED)).toBe(false);
  });

  it('should return false if PermissionStrategy not found', () => {
    Object.defineProperty(service, 'permissionStrategies', { value: {}, writable: true });

    expect(service.hasPermission(PermissionStrategy.AUTHENTICATED)).toBe(false);
  });
});
