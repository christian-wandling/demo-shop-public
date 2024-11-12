import { fakeAsync, TestBed } from '@angular/core/testing';

import { KeycloakService } from './keycloak.service';
import { AUTH_CONFIG } from '../models/auth-config';

jest.mock('keycloak-js', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      init: jest.fn().mockResolvedValue(true),
      login: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn().mockResolvedValue(undefined),
      register: jest.fn().mockResolvedValue(undefined),
      token: 'token',
      authenticated: true,
    })),
  };
});

describe('KeycloakService', () => {
  let service: KeycloakService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AUTH_CONFIG, useValue: {} }],
    });
    service = TestBed.inject(KeycloakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the token', () => {
    expect(service.token).toBe('token');
  });

  it('should return true if use is authenticated', () => {
    expect(service.authenticated).toBe(true);
  });

  it('should init', fakeAsync(() => {
    expect(service.init()).resolves.toBe(true);
  }));

  it('should login', fakeAsync(() => {
    expect(service.login()).resolves.toBeUndefined();
  }));

  it('should logout', fakeAsync(() => {
    expect(service.logout()).resolves.toBeUndefined();
  }));

  it('should register', fakeAsync(() => {
    expect(service.register()).resolves.toBeUndefined();
  }));
});
