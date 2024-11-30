#!/bin/bash

apply_secret() {
  local container_name="$1"
  local secret_file="$2"
  local -a env_files=("${@:3}")

  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

  # Check if logging utils exist
  if [ ! -f "${SCRIPT_DIR}/logging-utils.sh" ]; then
    echo "[Error] logging-utils.sh not found"
    return 1
  fi
  source "${SCRIPT_DIR}/logging-utils.sh"

  # Validate input parameters
  if [ -z "$container_name" ] || [ -z "$secret_file" ]; then
    log_error "Missing required parameters."
    log_error "Usage: apply_secret <container_name> <secret_file> [env_files...]"
    log_error "Example: apply_secret \"postgres\" \"postgres-secrets.yaml\" \"env1.txt\" \"env2.txt\""
    return 1
  fi

  # Early return if no env files
  if [ ${#env_files[@]} -eq 0 ]; then
    return 0
  fi

  # Check if envsubst is available
  if ! command -v envsubst >/dev/null 2>&1; then
    log_error "envsubst command not found"
    return 1
  fi

  # Create temporary files
  local temp_file
  local hydrated_file
  temp_file="$(mktemp)" || {
    log_error "Failed to create temp file"
    return 1
  }
  hydrated_file="$(mktemp)" || {
    log_error "Failed to create hydrated file"
    rm -f "$temp_file"
    return 1
  }

  # Set up cleanup trap after creating files
  trap 'rm -f "${temp_file}" "${hydrated_file}"' EXIT
  trap 'rm -f "${temp_file}" "${hydrated_file}"; exit 1' INT TERM

  # Create initial hydrated file
  cp -- "$secret_file" "$hydrated_file" || {
    log_error "Failed to create initial hydrated file"
    return 1
  }

  # Create a temporary env file to accumulate all variables
  local combined_env
  combined_env="$(mktemp)" || {
    log_error "Failed to create combined env file"
    return 1
  }
  trap 'rm -f "${temp_file}" "${hydrated_file}" "${combined_env}"' EXIT

  # Combine all env files into one
  for env_file in "${env_files[@]}"; do
    if [ ! -f "$env_file" ]; then
      log_error "env file '$env_file' not found"
      return 1
    fi

    # Append each env file to the combined file
    cat "$env_file" >> "$combined_env" || {
      log_error "Failed to append $env_file to combined env file"
      return 1
    }
    # Add a newline for safety
    echo "" >> "$combined_env"
  done

  # Source the combined environment file
  set -a
  source "$combined_env" || {
    log_error "Failed to source combined env file"
    return 1
  }
  set +a

  # Substitute values
  if ! envsubst <"${hydrated_file}" >"${temp_file}"; then
    log_error "Failed to substitute environment variables"
    return 1
  fi

  if ! mv -- "$temp_file" "$hydrated_file"; then
    log_error "Failed to update hydrated file"
    return 1
  fi

  if ! command -v kubectl >/dev/null 2>&1; then
    log_error "kubectl command not found"
    return 1
  fi

  # Apply the hydrated secret to kubernetes
  if ! kubectl apply -f "$hydrated_file"; then
    log_error "Failed to apply hydrated secret to kubernetes"
    return 1
  fi

  log_info "Successfully created and applied hydrated secret file: $secret_file"
  return 0
}
