export const environment = {
  production: true,
  keycloak: {
    url: '$KEYCLOAK_URL',
    realm: '$KEYCLOAK_REALM',
    clientId: '$KEYCLOAK_CLIENT_UI',
  },
  sentry: {
    enabled: true,
    dsn: '$SENTRY_DEMO_SHOP_UI_DSN',
    trustedDomain: '$SENTRY_TRUSTED_DOMAIN',
  },
};
