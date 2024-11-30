const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  new NxAppWebpackPlugin({
    target: 'node',
    compiler: 'tsc',
    main: './src/main.ts',
    tsConfig: './tsconfig.app.json',
    assets: ['./src/assets'],
    optimization: isProduction,
    outputHashing: 'none',
    watch: true,
    sourceMap: isProduction ? 'hidden' : true,
  }),
];

if (isProduction) {
  plugins.push(
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_DEMO_SHOP_API_PROJECT,
      telemetry: false,
    })
  );
}

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  output: {
    path: join(__dirname, '../../dist/apps/backend'),
  },
  plugins,
  externals: [nodeExternals()],
};
