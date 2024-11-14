const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
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
      optimization: false,
      outputHashing: 'none',
      watch: true,
    }),
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'christian-wandling',
      project: 'demo-shop',
    }),
  ],

  externals: [nodeExternals()],
  devtool: 'source-map',
};
