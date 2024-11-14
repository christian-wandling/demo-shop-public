#!/bin/bash

# Make the initialize_keycloak function available when sourced
initialize_keycloak() {
  if ! _check_jq_installed; then
    return 1
  fi

  _main "$1"
}

_check_jq_installed() {
  if ! command -v jq &>/dev/null; then
    log_error "jq is not installed. Please install jq to proceed."
    exit 1
  fi
  return 0
}

# Main function renamed to _main to avoid naming conflicts
_main() {
  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" || exit 1
  local UTILS_DIR="${SCRIPT_DIR}/../utils"
  local SECRETS_DIR="${SCRIPT_DIR}/../../../../secrets"

  if ! source "${UTILS_DIR}/logging-utils.sh"; then
    echo "Error: Failed to source logging utilities" >&2
    return 1
  fi

  # Read configuration from secret files
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

  readonly MAX_RETRIES="${MAX_RETRIES:-30}"
  readonly RETRY_INTERVAL="${RETRY_INTERVAL:-5}"

  _wait_for_keycloak() {
    local url="$1"
    local retries=0
    log_info "Waiting for Keycloak to be ready at $url..."
    while [ $retries -lt "$MAX_RETRIES" ]; do
      if curl -s -f "$url/health/ready" >/dev/null; then
        log_info "Keycloak is ready!"
        return 0
      fi
      retries=$((retries + 1))
      log_warn "Keycloak not ready. Attempt $retries of $MAX_RETRIES..."
      sleep "$RETRY_INTERVAL"
    done
    log_error "Keycloak did not become ready within the timeout period"
    return 1
  }

  _get_access_token() {
    local url="$1"
    local username="$2"
    local password="$3"

    log_info "Getting access token..."
    local token_response
    token_response=$(curl -s -X POST \
      "${url}/realms/master/protocol/openid-connect/token" \
      -H "Content-Type: application/x-www-form-urlencoded" \
      -d "username=${username}" \
      -d "password=${password}" \
      -d "grant_type=password" \
      -d "client_id=admin-cli")

    if [ $? -ne 0 ]; then
      log_error "Failed to obtain access token"
      return 1
    fi

    local access_token
    access_token=$(echo "$token_response" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

    if [ -z "$access_token" ]; then
      log_error "Failed to extract access token from response"
      return 1
    fi

    echo "$access_token"
    return 0
  }

  _check_realm_exists() {
    local url="$1"
    local access_token="$2"
    local realm_name="$3"

    log_info "Checking if realm '$realm_name' exists..."

    local response
    response=$(curl -s -X GET \
      "${url}/admin/realms?briefRepresentation=true" \
      -H "Authorization: Bearer ${access_token}")

    # Echo the response to the terminal
    if echo "$response" | jq -e --arg realm "$realm_name" '.[] | select(.realm == $realm) | length > 0' >/dev/null; then
      log_info "Realm '$realm_name' exists."
      return 0
    else
      log_info "Realm '$realm_name' does not exist."
      return 1
    fi
  }

  _import_realm() {
    local url="$1"
    local access_token="$2"
    local realm_file="$3"

    if [ ! -f "$realm_file" ]; then
      log_error "Realm export file not found: $realm_file"
      return 1
    fi

    log_info "Importing realm from $realm_file..."

    local response
    response=$(curl -s -X POST \
      "${url}/admin/realms" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${access_token}" \
      --data-binary "@${realm_file}")

    if [ $? -eq 0 ] && [ -z "$response" ]; then
      log_info "Realm import completed successfully"
      return 0
    else
      log_error "Failed to import realm. Response: $response"
      return 1
    fi
  }

  _extract_realm_name() {
    local realm_file="$1"
    jq -r '.realm' "$realm_file"
  }

  _initialize() {
    local realm_file="$1"

    # Wait for Keycloak to be ready
    if ! _wait_for_keycloak "$KEYCLOAK_URL"; then
      return 1
    fi

    # Get access token
    local access_token
    access_token=$(_get_access_token "$KEYCLOAK_URL" "$KEYCLOAK_ADMIN" "$KEYCLOAK_ADMIN_PASSWORD")
    if [ $? -ne 0 ]; then
      return 1
    fi

    # Import realm
    local realm_name
    realm_name=$(_extract_realm_name "$realm_file")
    if _check_realm_exists "$KEYCLOAK_URL" "$access_token" "$realm_name"; then
      log_info "Skipping import as realm already exists."
    elif ! _import_realm "$KEYCLOAK_URL" "$access_token" "$realm_file"; then
      return 1
    fi

    log_info "Keycloak initialization completed successfully"
    return 0
  }

  # Check if realm file is provided
  if [ -z "$1" ]; then
    echo "Usage: $0 <realm-export.json>" >&2
    return 1
  fi

  # Run initialization
  if _initialize "$1"; then
    return 0
  else
    return 1
  fi
}

# Only run main if the script is being run directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  _main "$@"
  exit $?
fi
