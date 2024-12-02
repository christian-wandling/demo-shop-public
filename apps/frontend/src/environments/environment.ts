export const environment = {
  production: true,
  keycloak: {
    url: '$KEYCLOAK_URL',
    realm: '$KEYCLOAK_REALM',
    clientId: '$KEYCLOAK_CLIENT_UI',
  },
};
