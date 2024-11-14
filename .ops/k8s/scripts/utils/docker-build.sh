#!/bin/bash

function docker_build() {
  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  source "${SCRIPT_DIR}/logging-utils.sh"

  if [ -z "$1" ]; then
    log_error "App name is required"
    return 1
  fi

  local app_name=$1
  local dockerfile_path=$2

  # Check if Dockerfile exists
  if [ ! -f "${dockerfile_path}" ]; then
    log_error "Dockerfile not found in ${dockerfile_path}"
    return 1
  fi

  # Attempt to build
  if docker build -t "${app_name}:latest" -f "${dockerfile_path}" .; then
    log_info "Successfully built ${app_name}:latest"
    return 0
  else
    log_error "Docker build failed for ${app_name}"
    return 1
  fi
}
