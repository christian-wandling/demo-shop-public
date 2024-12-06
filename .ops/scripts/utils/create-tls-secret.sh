#!/bin/bash

create_tls_secret() {
  local secret_name=$1
  local cert_path=$2
  local key_path=$3
  local namespace=${4:-default}

  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  source "${SCRIPT_DIR}/logger.sh"

  if [[ -z "$secret_name" || -z "$cert_path" || -z "$key_path" ]]; then
    log_error "Usage: create_tls_secret <secret_name> <cert_path> <key_path> [namespace]"
    return 1
  fi

  if [[ ! -f "$cert_path" || ! -f "$key_path" ]]; then
    log_error "Certificate or key file not found."
    return 1
  fi

  # Check if the secret already exists
  kubectl get secret "$secret_name" --namespace="$namespace" &>/dev/null

  if [[ $? -eq 0 ]]; then
    log_info "Secret '$secret_name' already exists in namespace '$namespace'. Skipping creation."
  else
    log_info "Creating secret '$secret_name' in namespace '$namespace'."

    kubectl create secret tls "$secret_name" \
      --cert="$cert_path" \
      --key="$key_path" \
      --namespace="$namespace"

    if [[ $? -eq 0 ]]; then
      log_info "Secret '$secret_name' created successfully in namespace '$namespace'."
      return 0
    else
      log_error "Failed to create secret '$secret_name'."
      return 1
    fi
  fi
}
