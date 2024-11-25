#!/bin/bash

deploy_prod() {
  # Exit on any error
  set -e

  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

  source "${SCRIPT_DIR}/postgres/deploy-postgres.sh"
  source "${SCRIPT_DIR}/pgadmin/deploy-pgadmin.sh"
  source "${SCRIPT_DIR}/keycloak/deploy-keycloak.sh"
  source "${SCRIPT_DIR}/backend/deploy-backend.sh"
  source "${SCRIPT_DIR}/prisma/run-prisma-jobs.sh"
  source "${SCRIPT_DIR}/frontend/deploy-frontend.sh"

  setup || exit 1

  deploy_postgres || exit 1
  deploy_pgadmin || exit 1
  deploy_keycloak || exit 1
  deploy_backend || exit 1
  run_prisma_jobs || exit 1
  deploy_frontend || exit 1

  cleanup || exit 1

  return 0
}

setup() {
  mkdir -p tmp
}

cleanup() {
  rm -rf tmp
}

deploy_prod
