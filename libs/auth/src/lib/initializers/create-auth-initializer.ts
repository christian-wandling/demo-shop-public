import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { KeycloakService } from '../services/keycloak.service';

export const createAuthInitializer = (): FactoryProvider => {
  function initialize(keycloakService: KeycloakService): () => Promise<boolean> {
    return async () => await keycloakService.init();
  }

  return {
    provide: APP_INITIALIZER,
    useFactory: initialize,
    multi: true,
    deps: [KeycloakService],
  };
};
