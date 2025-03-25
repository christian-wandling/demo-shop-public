import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { makeEnvironmentProviders } from '@angular/core';

export const provideImageLoader = () => {
  return makeEnvironmentProviders([
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        if (config.isPlaceholder) {
          return config.src.replace('640/480', '80/60');
        }
        return config.src;
      },
    },
  ]);
};

export const provideMockImageLoader = () => {
  return makeEnvironmentProviders([
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => config.src,
    },
  ]);
};
