#!/bin/bash

create_queries_configmap() {
  local queries_dir=$1
  local configmap_name=$2
  local namespace=${3:-default}

  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  local UTILS_DIR="${SCRIPT_DIR}/../utils"
  source "${UTILS_DIR}/logger.sh"

  if [[ -z "$queries_dir" || -z "$configmap_name" ]]; then
    log_error "Usage: create_queries_configmap <queries_dir> <configmap_name> [namespace]"
    return 1
  fi

  if [[ ! -d "$queries_dir" ]]; then
    log_error "Directory '$queries_dir' does not exist."
    return 1
  fi

  kubectl get configmap "$configmap_name" --namespace="$namespace" &>/dev/null

  if [[ $? -eq 0 ]]; then
    log_info "ConfigMap '$configmap_name' already exists in namespace '$namespace'. Skipping creation."
  else
    log_info "Creating secret '$configmap_name' in namespace '$namespace'."

    kubectl create configmap "$configmap_name" --from-file="$queries_dir" --namespace="$namespace"

    if [[ $? -eq 0 ]]; then
      log_success "ConfigMap '$configmap_name' created successfully in namespace '$namespace'."
    else
      log_error "Failed to create ConfigMap '$configmap_name'."
    fi
  fi
}
