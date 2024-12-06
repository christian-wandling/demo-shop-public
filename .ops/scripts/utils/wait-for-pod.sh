#!/bin/bash

wait_for_pod() {
  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  source "${SCRIPT_DIR}/logger.sh"

  if [ -z "$1" ]; then
    log_error "Container name parameter is required"
    return 1
  fi

  local container_name="$1"
  local timeout="${2:-300s}"
  local namespace="${3:-default}"

  log_info "Waiting for $container_name pod to be ready in namespace $namespace..."

  if ! kubectl get namespace "$namespace" >/dev/null 2>&1; then
    log_error "Namespace $namespace does not exist"
    return 1
  fi

  if kubectl wait --namespace="$namespace" --for=condition=ready pod -l app="$container_name" --timeout="$timeout"; then
    log_success "$container_name pod is ready in namespace $namespace"
    return 0
  else
    log_error "$container_name pod failed to become ready within $timeout timeout in namespace $namespace"
    return 1
  fi
}
