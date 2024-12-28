#!/bin/bash

run_prisma_jobs() {
  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  local UTILS_DIR="${SCRIPT_DIR}/../utils"
  local CONFIGS_DIR="${SCRIPT_DIR}/../../k8s"
  local DOCKER_DIR="${SCRIPT_DIR}/../../docker"
  local SECRETS_DIR="${SCRIPT_DIR}/../../../secrets"

  source "${UTILS_DIR}/logger.sh"
  source "${UTILS_DIR}/apply-secret.sh"
  source "${UTILS_DIR}/apply-configs.sh"
  source "${UTILS_DIR}/docker-build.sh"
  source "${UTILS_DIR}/run-jobs.sh"

  local ENV_FILES=(
    "${SECRETS_DIR}/postgres-credentials.txt"
    "${SECRETS_DIR}/keycloak-credentials.txt"
    "${SECRETS_DIR}/keycloak-config.txt"
  )

  local CONFIGS_FILES=(
    "${CONFIGS_DIR}/prisma/prisma-configmap.yaml"
  )

  local JOB_FILES=(
    "${CONFIGS_DIR}/prisma/prisma-migrate-job.yaml"
    "${CONFIGS_DIR}/prisma/prisma-seed-job.yaml"
  )

  local CONTAINER_NAME="prisma"
  local SECRET_FILE="${CONFIGS_DIR}/prisma/prisma-secrets.yaml"
  local DOCKER_FILE="${DOCKER_DIR}/prisma/Dockerfile"

  # Check if required functions are available
  if ! command -v apply_secret >/dev/null 2>&1 ||
    ! command -v apply_configs >/dev/null 2>&1 ||
    ! command -v docker_build >/dev/null 2>&1 ||
    ! command -v run_jobs >/dev/null 2>&1; then
    log_error "Required functions are not available"
    return 1
  fi

  apply_secret "${CONTAINER_NAME}" "${SECRET_FILE}" "${ENV_FILES[@]}" || return 1
  docker_build "${CONTAINER_NAME}" "${DOCKER_FILE}" || return 1
  apply_configs "${CONTAINER_NAME}" "${CONFIGS_FILES[@]}" || return 1
  run_jobs "${CONTAINER_NAME}" "${JOB_FILES[@]}" || return 1

  return 0
}

# Only execute if script is run directly (not sourced)
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  run_prisma_jobs "$@"
fi
