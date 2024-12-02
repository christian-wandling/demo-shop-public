import { Injectable } from '@angular/core';
import { MonitoredUser } from './models/monitored-user';
import * as Sentry from '@sentry/angular';

@Injectable({
  providedIn: 'root',
})
export class MonitoringFacade {
  setUser(user: MonitoredUser): void {
    Sentry.setUser({
      ...user,
      ip_address: 'none',
    });
  }
}
