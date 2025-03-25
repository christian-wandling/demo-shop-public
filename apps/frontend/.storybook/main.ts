import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/app/**/*.@(mdx|stories.@(js|jsx|ts|tsx))', '../../../libs/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      return config;
    }

    if (config.output) {
      // Ensure chunk filenames are versioned to prevent caching issues
      config.output.filename = '[name].[contenthash].js';
    }

    // Exclude sourcemaps
    config.devtool = false;

    // Optimize chunk loading
    config.optimization = {
      splitChunks: {
        chunks: 'all', // Split all chunks
        maxInitialRequests: 5,
        minSize: 20000,
      },
    };

    // Enable persistent caching for faster rebuilds
    config.cache = {
      type: 'filesystem',
    };

    // Increase timeout settings for chunk loading
    config.performance = {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    };

    return config;
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs
