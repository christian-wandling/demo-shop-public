import { Configuration } from '@demo-shop/api';
import { provideApi, withConfiguration } from './provide-api';
import { makeEnvironmentProviders } from '@angular/core';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  makeEnvironmentProviders: jest.fn(providers => undefined),
}));

describe('API Configuration', () => {
  describe('withConfiguration', () => {
    it('should create configuration with default basePath when no parameters provided', () => {
      const config = withConfiguration();

      expect(config).toBeInstanceOf(Configuration);
      expect(config.basePath).toBe('http://localhost:3000');
    });

    it('should override default configuration with provided parameters', () => {
      const customConfig = withConfiguration({
        basePath: 'https://api.example.com',
      });

      expect(customConfig).toBeInstanceOf(Configuration);
      expect(customConfig.basePath).toBe('https://api.example.com');
    });
  });

  describe('provideApi', () => {
    beforeEach(() => {
      // Clear mock calls before each test
      jest.clearAllMocks();
    });

    it('should create environment providers with default configuration', () => {
      provideApi();

      expect(makeEnvironmentProviders).toHaveBeenCalledTimes(1);
      expect(makeEnvironmentProviders).toHaveBeenCalledWith([
        { provide: Configuration, useValue: expect.any(Configuration) },
      ]);
    });

    it('should create environment providers with custom configuration', () => {
      const customConfig = withConfiguration({
        basePath: 'https://api.example.com',
      });
      provideApi(customConfig);

      expect(makeEnvironmentProviders).toHaveBeenCalledTimes(1);
      expect(makeEnvironmentProviders).toHaveBeenCalledWith([{ provide: Configuration, useValue: customConfig }]);
    });
  });
});
