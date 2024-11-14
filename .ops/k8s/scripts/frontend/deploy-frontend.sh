#!/bin/bash

deploy_frontend() {
  local SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  local UTILS_DIR="${SCRIPT_DIR}/../utils"
  local CONFIGS_DIR="${SCRIPT_DIR}/../../configs"
  local ROOT_DIR="${SCRIPT_DIR}/../../../../"
  local SECRETS_DIR="${ROOT_DIR}/secrets"

  source "${UTILS_DIR}/logging-utils.sh"
  source "${UTILS_DIR}/map-secrets.sh"
  source "${UTILS_DIR}/apply-configs.sh"
  source "${UTILS_DIR}/wait-for-pod.sh"
  source "${UTILS_DIR}/docker-build.sh"

  local SECRETS_FILES=(
    "${SECRETS_DIR}/keycloak-config.txt"
  )

  local CONFIG_FILES=(
    "tmp/frontend-secrets.yaml"
    "${CONFIGS_DIR}/frontend/frontend-service.yaml"
    "${CONFIGS_DIR}/frontend/frontend-deployment.yaml"
  )

  local CONTAINER_NAME="frontend"
  local TEMPLATE_FILE="${CONFIGS_DIR}/frontend/frontend-secrets.yaml"
  local DOCKER_FILE="${ROOT_DIR}/apps/frontend/Dockerfile"

  # Check if required functions are available
  if ! command -v map_secrets >/dev/null 2>&1 ||
    ! command -v apply_configs >/dev/null 2>&1 ||
    ! command -v docker_build >/dev/null 2>&1 ||
    ! command -v wait_for_pod >/dev/null 2>&1; then
    log_error "Required functions are not available"
    return 1
  fi

  map_secrets "${CONTAINER_NAME}" "${TEMPLATE_FILE}" "${SECRETS_FILES[@]}" || return 1
  docker_build "${CONTAINER_NAME}" "${DOCKER_FILE}" || return 1
  apply_configs "${CONTAINER_NAME}" "${CONFIG_FILES[@]}" || return 1
  wait_for_pod "${CONTAINER_NAME}" || return 1

  return 0
}

# Only execute if script is run directly (not sourced)
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  deploy_frontend "$@"
fi
