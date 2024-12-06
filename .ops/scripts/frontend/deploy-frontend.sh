#!/bin/bash

deploy_frontend() {
  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  local UTILS_DIR="${SCRIPT_DIR}/../utils"
  local CONFIGS_DIR="${SCRIPT_DIR}/../../k8s"
  local ROOT_DIR="${SCRIPT_DIR}/../../../"
  local SECRETS_DIR="${ROOT_DIR}/secrets"

  source "${UTILS_DIR}/logger.sh"
  source "${UTILS_DIR}/apply-configs.sh"
  source "${UTILS_DIR}/wait-for-pod.sh"
  source "${UTILS_DIR}/docker-build.sh"

  local CONFIG_FILES=(
    "${CONFIGS_DIR}/frontend/frontend-service.yaml"
    "${CONFIGS_DIR}/frontend/frontend-deployment.yaml"
  )

  local ENV_FILES=(
    "${SECRETS_DIR}/keycloak-config.txt"
    "${SECRETS_DIR}/sentry-config.txt"
  )

  local CONTAINER_NAME="frontend"
  local DOCKER_FILE="${ROOT_DIR}/apps/frontend/Dockerfile"

  # Check if required functions are available
  if ! command -v apply_configs >/dev/null 2>&1 ||
    ! command -v docker_build >/dev/null 2>&1 ||
    ! command -v wait_for_pod >/dev/null 2>&1; then
    log_error "Required functions are not available"
    return 1
  fi

  docker_build "${CONTAINER_NAME}" "${DOCKER_FILE}" "${ENV_FILES[@]}" || return 1
  apply_configs "${CONTAINER_NAME}" "${CONFIG_FILES[@]}" || return 1
  wait_for_pod "${CONTAINER_NAME}" || return 1

  return 0
}

# Only execute if script is run directly (not sourced)
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  deploy_frontend "$@"
fi
