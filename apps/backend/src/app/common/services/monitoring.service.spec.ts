import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringService } from './monitoring.service';
import * as Sentry from '@sentry/nestjs';
import { MonitoredUser } from '../models/monitored-user';

jest.mock('@sentry/nestjs', () => ({
  setUser: jest.fn(),
}));

describe('MonitoringService', () => {
  let service: MonitoringService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoringService],
    }).compile();

    service = module.get<MonitoringService>(MonitoringService);
  });

  describe('setUser', () => {
    it('should call Sentry.setUser with user data and ip_address set to none', () => {
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

    it('should handle empty user object', () => {
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
