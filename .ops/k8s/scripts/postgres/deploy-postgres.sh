#!/bin/bash

deploy_postgres() {
  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  local UTILS_DIR="${SCRIPT_DIR}/../utils"
  local CONFIGS_DIR="${SCRIPT_DIR}/../../configs"
  local ROOT_DIR="${SCRIPT_DIR}/../../../../"
  local SECRETS_DIR="${ROOT_DIR}/secrets"

  source "${UTILS_DIR}/logging-utils.sh"
  source "${UTILS_DIR}/map-secrets.sh"
  source "${UTILS_DIR}/apply-configs.sh"
  source "${UTILS_DIR}/wait-for-pod.sh"
  source "${SCRIPT_DIR}/create-queries-configmap.sh"

  local QUERIES_DIR="${CONFIGS_DIR}/postgres/queries"

  local SECRETS_FILES=(
    "${SECRETS_DIR}/postgres-credentials.txt"
  )

  local CONFIG_FILES=(
    "${CONFIGS_DIR}/postgres/postgres-pv.yaml"
    "${CONFIGS_DIR}/postgres/postgres-pvc.yaml"
    "${CONFIGS_DIR}/postgres/postgres-configmap.yaml"
    "tmp/postgres-secrets.yaml"
    "${CONFIGS_DIR}/postgres/postgres-service.yaml"
    "${CONFIGS_DIR}/postgres/postgres-deployment.yaml"
  )

  local CONTAINER_NAME="postgres"
  local TEMPLATE_FILE="${CONFIGS_DIR}/postgres/postgres-secrets.yaml"
  local CONFIG_MAP_NAME="postgres-init-queries"

  # Check if required functions are available
  if ! command -v map_secrets >/dev/null 2>&1 ||
    ! command -v create_queries_configmap >/dev/null 2>&1 ||
    ! command -v apply_configs >/dev/null 2>&1 ||
    ! command -v wait_for_pod >/dev/null 2>&1; then
    log_error "Required functions are not available"
    return 1
  fi

  map_secrets "${CONTAINER_NAME}" "${TEMPLATE_FILE}" "${SECRETS_FILES[@]}" || return 1
  create_queries_configmap "${QUERIES_DIR}" "${CONFIG_MAP_NAME}"
  apply_configs "${CONTAINER_NAME}" "${CONFIG_FILES[@]}" || return 1
  wait_for_pod "${CONTAINER_NAME}" || return 1

  return 0
}

# Only execute if script is run directly (not sourced)
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  deploy_postgres "$@"
fi
