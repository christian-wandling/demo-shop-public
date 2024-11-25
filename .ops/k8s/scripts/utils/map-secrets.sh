#!/bin/bash

map_secrets() {
  local container_name="$1"
  local template_file="$2"
  local -a secret_files=("${@:3}")

  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  source "${SCRIPT_DIR}/logging-utils.sh"

  # Validate input parameters
  if [ -z "$container_name" ] || [ -z "$template_file" ]; then
    log_error "Missing required parameters."
    log_error "Usage: map_secrets <container_name> <template_file> [secret_files...]"
    log_error "Example: map_secrets \"postgres\" \"postgres-secrets.yaml\" \"secrets1.txt\" \"secrets2.txt\""
    return 1
  fi

  if [ ${#secret_files[@]} -eq 0 ]; then
    return 0
  fi

  for secrets_file in "${secret_files[@]}"; do
    if ! map_k8s_secret "$secrets_file" "$template_file"; then
      log_error "Failed to map secrets for $container_name from file: $secrets_file"
      return 1
    fi
  done

  log_info "Successfully created secret file: ${output_dir}/${template_filename}"
  return 0
}

map_k8s_secret() {
  local secrets_file="$1"
  local template_file="$2"
  local output_dir="${3:-tmp}" # Allow configurable output directory with default 'tmp'

  # Validate input parameters
  if [ -z "$secrets_file" ] || [ -z "$template_file" ]; then
    log_error "Missing required parameters."
    log_error "Usage: map_k8s_secret <secrets_file> <template_file> [output_dir]"
    log_error "Example: map_k8s_secret \"/path/to/secrets/postgres-credentials.txt\" \"postgres-secrets.yaml\" \"output\" "
    return 1
  fi

  # Check if secrets file exists
  if [ ! -f "$secrets_file" ]; then
    log_error "secrets file '$secrets_file' not found"
    return 1
  fi

  # Check if template file exists
  if [ ! -f "$template_file" ]; then
    log_error "template file '$template_file' not found"
    return 1
  fi

  # Create output directory if it doesn't exist
  mkdir -p "$output_dir" || {
    log_error "Failed to create output directory '$output_dir'"
    return 1
  }

  # Check if envsubst is available
  if ! command -v envsubst >/dev/null 2>&1; then
    log_error "envsubst command not found"
    return 1
  fi

  # Source the credentials file to export variables
  source "$secrets_file" || {
    log_error "Failed to source $secrets_file"
    return 1
  }

  # Export variables
  while IFS='=' read -r key value; do
    # Skip empty lines or lines starting with #
    [[ -z "$key" || "$key" =~ ^[[:space:]]*# ]] && continue

    # Remove any leading/trailing whitespace
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)

    # Export the variable
    export "$key=$value"
  done <"$secrets_file"

  template_filename=$(basename "$template_file")

  # Create secret file with substituted values
  envsubst <"$template_file" >"${output_dir}/${template_filename}" || {
    log_error "Failed to create secret file with substituted values"
    return 1
  }

  return 0
}
