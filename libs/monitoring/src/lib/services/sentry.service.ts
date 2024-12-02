import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';

@Injectable({
  providedIn: 'root',
})
export class SentryService {
  setUser(id?: string): void {
    Sentry.setUser({
      id,
      ip_address: 'none',
    });
  }
}
