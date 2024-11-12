import { inject, Injectable } from '@angular/core';
import { KeycloakService } from './services/keycloak.service';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  readonly #keycloakService = inject(KeycloakService);

  async authorize(): Promise<boolean> {
    return await this.#keycloakService.init();
  }

  async login(): Promise<void> {
    await this.#keycloakService.login();
  }

  async logout(): Promise<void> {
    await this.#keycloakService.logout();
  }

  async register(): Promise<void> {
    await this.#keycloakService.register();
  }

  isAuthenticated(): boolean {
    return this.#keycloakService.authenticated;
  }

  getToken(): string | undefined {
    return this.#keycloakService.token;
  }
}
