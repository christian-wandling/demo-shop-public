#!/bin/sh

update_angular_environment() {
  environment_file="$1"
  shift

  # Validate input parameters
  if [ -z "$environment_file" ] || [ $# -eq 0 ]; then
    echo "[ERROR] Missing required parameters"
    echo "[ERROR] Usage: update_angular_environment <environment_file> <secrets_file1> [<secrets_file2> ...]"
    echo "[ERROR] Example: update_angular_environment \"/path/to/environments/environment.ts\" \"secrets1.txt\" \"secrets2.txt\""
    return 1
  fi

  # Check if environment file exists
  if [ ! -f "$environment_file" ]; then
    echo "[ERROR] Environment file '$environment_file' not found"
    return 1
  fi

  # Check if each secrets file exists
  for secrets_file in "$@"; do
    if [ ! -f "$secrets_file" ]; then
      echo "[ERROR] Secrets file '$secrets_file' not found"
      return 1
    fi
  done

  # Check if envsubst is available
  if ! command -v envsubst >/dev/null 2>&1; then
    echo "[ERROR] Envsubst command not found"
    return 1
  fi

  # Export variables from all secrets files
  set -a # Automatically export variables
  for secrets_file in "$@"; do
    . "$secrets_file" || {
      echo "[ERROR] Failed to source $secrets_file"
      exit 1
    }
  done
  set +a

  echo "[INFO] Updating permissions for '$environment_file'"
  chmod u+w "$environment_file" || {
    echo "[ERROR] Failed to update permissions for '$environment_file'"
    exit 1
  }

  # Create secret file with substituted values using a temp file
  if envsubst <"$environment_file" >"$environment_file.tmp"; then
    mv "$environment_file.tmp" "$environment_file"
  else
    echo "[ERROR] Failed to create environment file with substituted values"
    return 1
  fi

  echo "[INFO] Successfully replaced env variables in ${environment_file}"
  return 0
}

update_angular_environment "$@"
