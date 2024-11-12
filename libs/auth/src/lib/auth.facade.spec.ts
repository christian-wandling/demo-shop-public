import { TestBed } from '@angular/core/testing';

import { AuthFacade } from './auth.facade';
import { KeycloakService } from './services/keycloak.service';

describe('AuthFacade', () => {
  let service: AuthFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: KeycloakService, useValue: {} }],
    });
    service = TestBed.inject(AuthFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
