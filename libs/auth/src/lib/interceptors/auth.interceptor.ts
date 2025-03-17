import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthFacade } from '../auth.facade';

/**
 * HttpInterceptor that sets Bearer Authorization header if access token if user is authenticated
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade);

  if (!authFacade.isAuthenticated()) {
    return next(req);
  }

  return next(
    req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authFacade.getToken()}`),
    })
  );
};
