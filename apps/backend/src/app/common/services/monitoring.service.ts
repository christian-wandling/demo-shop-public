import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { MonitoredUser } from '../models/monitored-user';

@Injectable()
export class MonitoringService {
  setUser(user: MonitoredUser): void {
    Sentry.setUser({
      ...user,
      ip_address: 'none',
    });
  }
}
