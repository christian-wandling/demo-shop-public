/**
 * Represents a decoded authentication token with user information from keycloak
 *
 * @property given_name - The user's first name
 * @property family_name - The user's last name
 * @property email - The user's email address
 * @property sub - The subject identifier (unique keycloak user ID)
 */
export type DecodedToken = {
  given_name: string;
  family_name: string;
  email: string;
  sub: string;
};
