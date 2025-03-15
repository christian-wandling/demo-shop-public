import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringService } from './monitoring.service';
import * as Sentry from '@sentry/nestjs';
import { MonitoredUser } from '../models/monitored-user';

jest.mock('@sentry/nestjs', () => ({
  setUser: jest.fn(),
}));

describe('MonitoringService', () => {
  let service: MonitoringService;
  const originalEnv = process.env;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoringService],
    }).compile();

    process.env = { ...originalEnv };
    service = module.get<MonitoringService>(MonitoringService);
  });

  describe('setUser', () => {
    it('should call Sentry.setUser if Sentry is configured', () => {
      process.env.SENTRY_AUTH_TOKEN = 'test-token';
      process.env.SENTRY_ORG = 'test-org';
      process.env.SENTRY_DEMO_SHOP_API_PROJECT = 'test-project';
      process.env.SENTRY_DEMO_SHOP_API_DSN = 'test-dsn';

      const mockUser: MonitoredUser = {
        id: 123,
      };

      service.setUser(mockUser);

      expect(Sentry.setUser).toHaveBeenCalledTimes(1);
      expect(Sentry.setUser).toHaveBeenCalledWith({
        ...mockUser,
        ip_address: 'none',
      });
    });

    it('should not call Sentry.setUser if Sentry is not configured', () => {
      process.env.SENTRY_AUTH_TOKEN = '';
      process.env.SENTRY_ORG = '';
      process.env.SENTRY_DEMO_SHOP_API_PROJECT = '';
      process.env.SENTRY_DEMO_SHOP_API_DSN = '';

      const mockUser: MonitoredUser = {
        id: 123,
      };

      service.setUser(mockUser);

      expect(Sentry.setUser).not.toHaveBeenCalled();
    });

    it('should handle empty user object', () => {
      process.env.SENTRY_AUTH_TOKEN = 'test-token';
      process.env.SENTRY_ORG = 'test-org';
      process.env.SENTRY_DEMO_SHOP_API_PROJECT = 'test-project';
      process.env.SENTRY_DEMO_SHOP_API_DSN = 'test-dsn';

      const emptyUser: MonitoredUser = { id: undefined };

      service.setUser(emptyUser);

      expect(Sentry.setUser).toHaveBeenCalledTimes(1);
      expect(Sentry.setUser).toHaveBeenCalledWith({
        ...emptyUser,
        ip_address: 'none',
      });
    });
  });
});
