import { makeEnvironmentProviders } from '@angular/core';
import { provideImageLoader, provideMockImageLoader } from './provide-image-loader';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  makeEnvironmentProviders: jest.fn(),
}));

describe('Image Loader Providers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create provideImageLoaderR', () => {
    provideImageLoader();

    expect(makeEnvironmentProviders).toHaveBeenCalledTimes(1);
  });

  it('should create provideMockImageLoader', () => {
    provideMockImageLoader();
    expect(makeEnvironmentProviders).toHaveBeenCalledTimes(1);
  });
});
