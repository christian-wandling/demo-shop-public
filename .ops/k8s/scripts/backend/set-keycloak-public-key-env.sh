#!/bin/bash

set_keycloak_public_key_env() {
  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  local SECRETS_DIR="${SCRIPT_DIR}/../../../../secrets"
  local UTILS_DIR="${SCRIPT_DIR}/../utils"
  source "${UTILS_DIR}/logging-utils.sh"

  local CONFIG_FILE="${SECRETS_DIR}/keycloak-config.txt"
  local CREDENTIALS_FILE="${SECRETS_DIR}/keycloak-credentials.txt"

  if [[ ! -f "$CONFIG_FILE" ]]; then
    log_error "Config file not found: $CONFIG_FILE"
    return 1
  fi

  if [[ ! -f "$CREDENTIALS_FILE" ]]; then
    log_error "Credentials file not found: $CREDENTIALS_FILE"
    return 1
  fi

  # Source the config files
  source "$CONFIG_FILE"
  source "$CREDENTIALS_FILE"

  # Validate required variables
  : "${KEYCLOAK_URL:?$(log_error "KEYCLOAK_URL is not set")}"
  : "${KEYCLOAK_REALM:?$(log_error "KEYCLOAK_REALM is not set")}"
  : "${KEYCLOAK_ADMIN:?$(log_error "KEYCLOAK_ADMIN is not set")}"
  : "${KEYCLOAK_ADMIN_PASSWORD:?$(log_error "KEYCLOAK_ADMIN_PASSWORD is not set")}"

  # Fetch the authentication token
  local token_response
  token_response=$(curl -s -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
    -d "username=${KEYCLOAK_ADMIN}" \
    -d "password=${KEYCLOAK_ADMIN_PASSWORD}" \
    -d "grant_type=password" \
    -d "client_id=admin-cli")

  # Extract the access token
  local access_token
  access_token=$(echo "$token_response" | jq -r '.access_token')

  # Check if the access token was retrieved successfully
  if [ -z "$access_token" ]; then
    log_error "Failed to retrieve the access token."
    return 1
  fi

  # Fetch the public key using the access token
  PUBLIC_KEY=$(curl -s -H "Authorization: Bearer $access_token" \
    "${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs" | jq -r '.keys[0].x5c[0]')

  # Check if the public key was retrieved successfully
  if [ -z "$PUBLIC_KEY" ]; then
    log_error "Failed to retrieve the public key."
    return 1
  fi

  # Set the environment variable
  export KEYCLOAK_REALM_PUBLIC_KEY="$PUBLIC_KEY"

  log_info "Set KEYCLOAK_REALM_PUBLIC_KEY environment variable."
}
