#!/bin/bash

set_keycloak_public_key_env() {
  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  local SECRETS_DIR="${SCRIPT_DIR}/../../../secrets"
  local UTILS_DIR="${SCRIPT_DIR}/../utils"
  source "${UTILS_DIR}/logger.sh"

  local CONFIG_FILE="${SECRETS_DIR}/keycloak-config.txt"

  if [[ ! -f "$CONFIG_FILE" ]]; then
    log_error "Config file not found: $CONFIG_FILE"
    return 1
  fi

  # Source the config files
  source "$CONFIG_FILE"

  # Validate required variables
  : "${KEYCLOAK_URL:?$(log_error "KEYCLOAK_URL is not set")}"
  : "${KEYCLOAK_REALM:?$(log_error "KEYCLOAK_REALM is not set")}"

  # Fetch the public key using the access token
  PUBLIC_KEY=$(curl -s "${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}" | jq -r '.public_key')

  # Check if the public key was retrieved successfully
  if [ -z "$PUBLIC_KEY" ]; then
    log_error "Failed to retrieve the public key."
    return 1
  fi

  # Set the environment variable
  kubectl patch secret backend-secrets -p "{\"data\":{\"KEYCLOAK_REALM_PUBLIC_KEY\":\"$(echo -n "$PUBLIC_KEY" | base64)\"}}"

  log_info "Set KEYCLOAK_REALM_PUBLIC_KEY secret."
}
