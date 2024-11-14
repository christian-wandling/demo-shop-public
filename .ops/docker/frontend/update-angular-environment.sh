#!/bin/bash

update_angular_environment() {
  local environment_file="$1"
  local secrets_file="$2"

  # Validate input parameters
  if [ -z "$environment_file" ] || [ -z "$secrets_file" ]; then
    echo "[ERROR] Missing required parameters"
    echo "Usage: update_angular_environment <environment_file> <secrets_file>"
    echo "Example: update_angular_environment \"/path/to/environments/environment.ts\" \"postgres-credentials.txt\""
    return 1
  fi

  # Check if template file exists
  if [ ! -f "$environment_file" ]; then
    echo "[ERROR] environment file '$environment_file' not found"
    return 1
  fi

  # Check if secrets file exists
  if [ ! -f "$secrets_file" ]; then
    echo "[ERROR] secrets file '$secrets_file' not found"
    return 1
  fi

  # Check if envsubst is available
  if ! command -v envsubst >/dev/null 2>&1; then
    echo "[ERROR] envsubst command not found"
    return 1
  fi

  # Export variables from the secrets file
  set -a # Automatically export variables
  . "$secrets_file" || {
    echo "[ERROR] Failed to source $secrets_file"
    exit 1
  }
  set +a

  echo "[INFO] Updating permissions for '$environment_file'"
  chmod u+w "$environment_file" || {
    echo "[ERROR] Failed to update permissions for '$environment_file'"
    exit 1
  }

  # Create secret file with substituted values using a temp file
  envsubst <"$environment_file" >"$environment_file.tmp" && mv "$environment_file.tmp" "$environment_file" || {
    echo "[ERROR] Failed to create environment file with substituted values"
    return 1
  }

  echo "[INFO] Successfully replaced env variables in ${environment_file}"

  return 0
}

update_angular_environment "$@"
