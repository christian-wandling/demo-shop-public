#!/usr/bin/env sh

upload_sourcemaps() {
  build_path="$1"
  org="$2"
  project="$3"

  if [ -z "$build_path" ] || [ -z "$org" ] || [ -z "$project" ]; then
    echo "[ERROR] Missing required parameters"
    echo "[ERROR] Usage: upload_sourcemaps <build_path> <org> <project>"
    echo "[ERROR] Example: upload_sourcemaps \"/path/to/build/\" \"my-org\" \"my-project\""
    return 1
  fi

  if ! command -v sentry-cli >/dev/null 2>&1; then
    echo "[ERROR] sentry-cli not found"
    return 1
  fi

  temp_dir=$(mktemp -d /tmp/sourcemaps-XXXXXX)
  if [ "$?" -ne 0 ]; then
    echo "[ERROR] Failed to create temporary directory"
    return 1
  fi

  # Set up trap to clean up temporary directory on script exit
  trap 'rm -rf "$temp_dir"' EXIT

  # Check if build path exists
  if [ ! -d "$build_path" ]; then
    echo "[ERROR] Build directory not found: $build_path"
    return 1
  fi

  echo "Creating temporary copy of build for sourcemap processing..."
  if ! cp -r "$build_path"/* "$temp_dir"; then
    echo "[ERROR] Failed to create temporary copy of build"
    return 1
  fi

  # Process sourcemaps in the temporary directory
  if ! sentry-cli sourcemaps inject "$temp_dir" --org "$org" --project "$project"; then
    echo "[ERROR] Failed to inject sourcemaps"
    return 1
  fi

  if ! sentry-cli sourcemaps upload "$temp_dir" --org "$org" --project "$project"; then
    echo "[ERROR] Failed to upload sourcemaps to Sentry"
    return 1
  fi

  echo "Successfully uploaded sourcemaps for organization '$org' project '$project'"
  return 0
}

upload_sourcemaps "$1" "$2" "$3"
