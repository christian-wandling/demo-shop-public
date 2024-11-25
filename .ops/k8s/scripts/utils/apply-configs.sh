#!/bin/bash

apply_configs() {
  local container_name="$1"
  local configs=("${@:2}")

  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  source "${SCRIPT_DIR}/logging-utils.sh"

  log_info "Applying $container_name configurations..."

  for config in "${configs[@]}"; do
    if [ -f "$config" ]; then
      log_info "Applying $config..."
      if kubectl apply -f "$config"; then
        log_info "$config applied successfully"
      else
        log_error "Failed to apply $config"
        return 1
      fi
    else
      log_error "Configuration file $config not found"
      return 1
    fi
  done

  return 0
}
