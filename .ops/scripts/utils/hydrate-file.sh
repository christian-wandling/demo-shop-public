#!/bin/sh
set -e

hydrate_file() {
  env_file="$1"
  shift
  vars="$*"

  # Input validation
  [ -z "$env_file" ] && {
    echo "Error: No environment file specified"
    return 1
  }
  [ -z "$vars" ] && {
    echo "Error: No variables specified"
    return 1
  }
  [ ! -f "$env_file" ] && {
    echo "Error: Environment file $env_file not found"
    return 1
  }
  [ ! -w "$env_file" ] && {
    echo "Error: No write permission for $env_file"
    return 1
  }
  [ ! -s "$env_file" ] && {
    echo "Error: Environment file $env_file is empty"
    return 1
  }
  [ -f "${env_file}.bak" ] && {
    echo "Error: Backup file already exists"
    return 1
  }

  # Check if envsubst is available
  command -v envsubst >/dev/null 2>&1 || {
    echo "Error: envsubst command not found"
    return 1
  }

  # Create backup
  if ! cp "$env_file" "${env_file}.bak"; then
    echo "Error: Failed to create backup file"
    return 1
  fi

  # Set up cleanup on exit
  trap 'rm -f "${env_file}.tmp"' EXIT

  # Create variable reference list for envsubst
  vars_ref=""
  for var in $vars; do
    if [ -z "$(printenv "$var")" ]; then
      echo "Warning: $var is not set"
      continue
    fi
    vars_ref="$vars_ref \${$var}"
  done

  # Remove leading space
  vars_ref=${vars_ref# }

  if [ -z "$vars_ref" ]; then
    echo "Error: No valid variables to substitute"
    mv "${env_file}.bak" "$env_file"
    return 1
  fi

  # Perform substitution
  if ! envsubst "$vars_ref" <"$env_file" >"${env_file}.tmp"; then
    echo "Error: Failed to perform variable substitution"
    mv "${env_file}.bak" "$env_file"
    rm -f "${env_file}.tmp"
    return 1
  fi

  # Replace original file with processed version
  if ! mv "${env_file}.tmp" "$env_file"; then
    echo "Error: Failed to update original file"
    mv "${env_file}.bak" "$env_file"
    return 1
  fi

  # Remove backup if everything succeeded
  rm "${env_file}.bak"
  return 0
}

# Main script
if [ $# -lt 2 ]; then
  echo "Usage: $0 env_file var1 [var2 ...]"
  exit 1
fi

if ! hydrate_file "$@"; then
  echo "Script failed"
  exit 1
fi

exit 0
