const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const nodeExternals = require('webpack-node-externals');
const { version } = require('../../package.json');

const {
  NODE_ENV = 'development',
  SENTRY_AUTH_TOKEN,
  SENTRY_ORG,
  SENTRY_DEMO_SHOP_API_PROJECT,
  SENTRY_DEMO_SHOP_API_DSN,
} = process.env;

const isProd = NODE_ENV === 'production';
const isSentryConfigured =
  !!SENTRY_AUTH_TOKEN && !!SENTRY_ORG && !!SENTRY_DEMO_SHOP_API_PROJECT && !!SENTRY_DEMO_SHOP_API_DSN;

const plugins = [
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
];

if (isSentryConfigured) {
  plugins.push(
    sentryWebpackPlugin({
      authToken: SENTRY_AUTH_TOKEN,
      org: SENTRY_ORG,
      project: SENTRY_DEMO_SHOP_API_PROJECT,
      release: version,
      telemetry: false,
    })
  );
}

module.exports = {
  mode: NODE_ENV,
  output: {
    path: join(__dirname, '../../dist/apps/backend'),
  },
  plugins,
  externals: [nodeExternals()],
};
