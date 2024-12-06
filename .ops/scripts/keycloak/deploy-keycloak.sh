#!/bin/bash

deploy_keycloak() {
  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  local UTILS_DIR="${SCRIPT_DIR}/../utils"
  local CONFIGS_DIR="${SCRIPT_DIR}/../../k8s"
  local ROOT_DIR="${SCRIPT_DIR}/../../../"
  local SECRETS_DIR="${ROOT_DIR}/secrets"

  source "${UTILS_DIR}/logger.sh"
  source "${UTILS_DIR}/apply-secret.sh"
  source "${UTILS_DIR}/apply-configs.sh"
  source "${UTILS_DIR}/wait-for-pod.sh"
  source "${UTILS_DIR}/create-tls-secret.sh"
  source "${SCRIPT_DIR}/initialize_keycloak.sh"

  local ENV_FILES=(
    "${SECRETS_DIR}/keycloak-config.txt"
    "${SECRETS_DIR}/keycloak-credentials.txt"
    "${SECRETS_DIR}/postgres-credentials.txt"
  )

  local CONFIG_FILES=(
    "${CONFIGS_DIR}/keycloak/keycloak-pvc.yaml"
    "${CONFIGS_DIR}/keycloak/keycloak-configmap.yaml"
    "${CONFIGS_DIR}/keycloak/keycloak-service.yaml"
    "${CONFIGS_DIR}/keycloak/keycloak-deployment.yaml"
  )

  local CONTAINER_NAME="keycloak"
  local SECRETS_FILE="${CONFIGS_DIR}/keycloak/keycloak-secrets.yaml"
  #  local CERT_FILE="${SECRETS_DIR}/keycloak-server.crt.pem"
  #  local KEY_FILE="${SECRETS_DIR}/keycloak-server.key.pem"
  local KEYCLOAK_INIT_FILE="${SECRETS_DIR}/realm-export.json"

  # Check if required functions are available
  if ! command -v create_tls_secret >/dev/null 2>&1 ||
    ! command -v apply_secret >/dev/null 2>&1 ||
    ! command -v apply_configs >/dev/null 2>&1 ||
    ! command -v wait_for_pod >/dev/null 2>&1 ||
    ! command -v initialize_keycloak >/dev/null 2>&1; then
    log_error "Required functions are not available"
    return 1
  fi

  #  create_tls_secret "keycloak-tls" "${CERT_FILE}" "${KEY_FILE}" || return 1
  apply_secret "${CONTAINER_NAME}" "${SECRETS_FILE}" "${ENV_FILES[@]}" || return 1
  apply_configs "${CONTAINER_NAME}" "${CONFIG_FILES[@]}" || return 1
  wait_for_pod "${CONTAINER_NAME}" || return 1
  initialize_keycloak "${KEYCLOAK_INIT_FILE}" || return 1

  return 0
}

# Only execute if script is run directly (not sourced)
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  deploy_keycloak "$@"
fi
