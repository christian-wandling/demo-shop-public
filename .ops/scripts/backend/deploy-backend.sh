#!/bin/bash

deploy_backend() {
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
  source "${UTILS_DIR}/docker-build.sh"
  source "${SCRIPT_DIR}/set-keycloak-public-key-env.sh"

  local ENV_FILES=(
    "${SECRETS_DIR}/postgres-credentials.txt"
    "${SECRETS_DIR}/keycloak-config.txt"
    "${SECRETS_DIR}/sentry-config.txt"
  )

  local CONFIGS_FILES=(
    "${CONFIGS_DIR}/backend/backend-configmap.yaml"
    "${CONFIGS_DIR}/backend/backend-service.yaml"
    "${CONFIGS_DIR}/backend/backend-deployment.yaml"
  )

  local CONTAINER_NAME="backend"
  local SECRETS_FILE="${CONFIGS_DIR}/backend/backend-secrets.yaml"
  local DOCKER_FILE="${ROOT_DIR}/apps/backend/Dockerfile"

  # Check if required functions are available
  if ! command -v apply_secret >/dev/null 2>&1 ||
    ! command -v apply_configs >/dev/null 2>&1 ||
    ! command -v docker_build >/dev/null 2>&1 ||
    ! command -v wait_for_pod >/dev/null 2>&1 ||
    ! command -v set_keycloak_public_key_env >/dev/null 2>&1; then
    log_error "Required functions are not available"
    return 1
  fi

  apply_secret "${CONTAINER_NAME}" "${SECRETS_FILE}" "${ENV_FILES[@]}" || return 1
  set_keycloak_public_key_env || return 1
  docker_build "${CONTAINER_NAME}" "${DOCKER_FILE}" "${ENV_FILES[@]}" || return 1
  apply_configs "${CONTAINER_NAME}" "${CONFIGS_FILES[@]}" || return 1
  wait_for_pod "${CONTAINER_NAME}" || return 1

  return 0
}

# Only execute if script is run directly (not sourced)
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  deploy_backend "$@"
fi
