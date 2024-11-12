import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';

import { authInterceptor } from './auth.interceptor';
import { AuthFacade } from '../auth.facade';
import { firstValueFrom, of } from 'rxjs';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => authInterceptor(req, next));
  const mockHandlerFn = (req: HttpRequest<any>) => of(new HttpResponse(req));
  let authFacade: AuthFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthFacade, useValue: { getToken: jest.fn(), isAuthenticated: jest.fn() } }],
    });
    authFacade = TestBed.inject(AuthFacade);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should return a new request with Authentication header set to Bearer token if authenticated', async () => {
    jest.spyOn(authFacade, 'isAuthenticated').mockReturnValue(true);
    jest.spyOn(authFacade, 'getToken').mockReturnValue('token');
    const mockRequest = new HttpRequest('GET', '/test');

    const req = (await firstValueFrom(interceptor(mockRequest, mockHandlerFn))) as HttpResponse<unknown>;

    expect(req.headers.get('Authorization')).toEqual('Bearer token');
  });

  it('should return the initial request without the Authorization header set if not authenticated', async () => {
    jest.spyOn(authFacade, 'isAuthenticated').mockReturnValue(false);
    const mockRequest = new HttpRequest('GET', '/test');

    const req = (await firstValueFrom(interceptor(mockRequest, mockHandlerFn))) as HttpResponse<unknown>;

    expect(req.headers.get('Authorization')).toBeNull();
  });
});
