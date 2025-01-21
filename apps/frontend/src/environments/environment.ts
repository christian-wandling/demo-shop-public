export const environment = {
  name: 'development',
  production: false,
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'demo_shop',
    clientId: 'demo_shop_ui',
  },
  sentry: {
    enabled: false,
    dsn: '',
    trustedDomain: '',
  },
};
