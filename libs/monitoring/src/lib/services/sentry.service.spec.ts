import { TestBed } from '@angular/core/testing';
import * as Sentry from '@sentry/angular';
import { SentryService } from './sentry.service';

jest.mock('@sentry/angular', () => ({
  setUser: jest.fn(),
}));

describe('SentryService', () => {
  let service: SentryService;

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [SentryService],
    });
    service = TestBed.inject(SentryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setUser', () => {
    it('should call Sentry.setUser with provided id and ip_address none', () => {
      const testId = 'test-user-id';

      service.setUser(testId);

      expect(Sentry.setUser).toHaveBeenCalledTimes(1);
      expect(Sentry.setUser).toHaveBeenCalledWith({
        id: testId,
        ip_address: 'none',
      });
    });

    it('should call Sentry.setUser with undefined id and ip_address none when no id is provided', () => {
      service.setUser();

      expect(Sentry.setUser).toHaveBeenCalledTimes(1);
      expect(Sentry.setUser).toHaveBeenCalledWith({
        id: undefined,
        ip_address: 'none',
      });
    });
  });
});
