const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const nodeExternals = require('webpack-node-externals');
const { version } = require('../../package.json');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  output: {
    path: join(__dirname, '../../dist/apps/backend'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: isProd,
      outputHashing: 'none',
      watch: true,
      sourceMap: isProd ? 'hidden' : true,
      generatePackageJson: true,
    }),
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_DEMO_SHOP_API_PROJECT,
      release: version,
      telemetry: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '../../prisma/schema.prisma',
          to: 'prisma/schema.prisma',
          filter: path => !path.includes('node_modules'),
        },
        {
          from: '../../prisma/migrations/',
          to: 'prisma/migrations/',
          filter: path => !path.includes('node_modules'),
        },
      ],
    }),
  ],
  externals: [nodeExternals()],
};
