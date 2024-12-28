#!/bin/bash

docker_build() {
    local SCRIPT_DIR
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    source "${SCRIPT_DIR}/logger.sh"

    # Set up error handling
    trap 'echo "Build interrupted"; exit 1' INT TERM

    local app_name=$1
    local dockerfile_path=$2
    local -a env_files=()
    local -a build_args=()  # Declare array earlier

    if [ $# -gt 2 ]; then
        env_files=("${@:3}")
    fi

    # Validate input parameters
    if [ -z "$app_name" ]; then
        log_error "Container name is required"
        log_error "Usage: docker_build <container_name> <dockerfile_path> [env_files...]"
        log_error "Example: docker_build \"postgres\" \"Dockerfile\" \"env1.txt\" \"env2.txt\""
        return 1
    fi

    if [ -z "$dockerfile_path" ]; then
        log_error "Dockerfile path is required"
        log_error "Usage: docker_build <container_name> <dockerfile_path> [env_files...]"
        log_error "Example: docker_build \"postgres\" \"Dockerfile\" \"env1.txt\" \"env2.txt\""
        return 1
    fi

    # Convert to absolute path with error handling
    dockerfile_path=$(realpath "$dockerfile_path") || {
        log_error "Failed to resolve path: $dockerfile_path"
        return 1
    }

    # Check if Dockerfile exists
    if [ ! -f "${dockerfile_path}" ]; then
        log_error "Dockerfile not found in ${dockerfile_path}"
        return 1
    fi

    # Build build-arg arguments from secret files
    for file in "${env_files[@]}"; do
        if [ ! -f "${file}" ]; then
            log_error "Secret file not found: ${file}"
            return 1
        fi

        # Read each line from the file and convert to build-arg
        local OLD_IFS="$IFS"
        while IFS='=' read -r key value; do
            # Skip empty lines and comments
            [[ -z "$key" || "$key" =~ ^[[:space:]]*# ]] && continue

            # Trim whitespace
            key=$(echo "$key" | xargs)
            value=$(echo "$value" | xargs)

            # Add to build arguments if both key and value are non-empty
            if [ -n "$key" ] && [ -n "$value" ]; then
                build_args+=("--build-arg" "${key}=${value}")
            fi
        done < "$file"
        IFS="$OLD_IFS"
    done

    # Ensure DOCKER_BUILDKIT is enabled
    : "${DOCKER_BUILDKIT:=1}"
    export DOCKER_BUILDKIT

    # Execute Docker build command
    if docker buildx build \
        "${build_args[@]}" \
        -t "${app_name}:latest" \
        -f "${dockerfile_path}" \
        .; then
        log_info "Successfully built ${app_name}:latest"
        return 0
    else
        log_error "Docker build failed for ${app_name}"
        return 1
    fi
}
