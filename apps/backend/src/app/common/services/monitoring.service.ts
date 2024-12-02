import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { MonitoredUser } from '../entities/monitored-user';

@Injectable()
export class MonitoringService {
  setUser(user: MonitoredUser) {
    Sentry.setUser({
      ...user,
      ip_address: 'none',
    });
  }
}
