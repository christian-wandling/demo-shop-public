#!/bin/bash

set -e

handle_error() {
    local exit_code=$?
    local line_number=$1
    echo "Error occurred in upload-sourcemaps.sh at line ${line_number}, exit code: ${exit_code}"
    exit $exit_code
}

trap 'handle_error ${LINENO}' ERR

# Check required environment variables
required_vars=(
    "SENTRY_AUTH_TOKEN"
    "SENTRY_ORG"
    "SENTRY_PROJECT"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: Missing required environment variable: $var"
        exit 1
    fi
done

echo "Starting Sentry processing..."

echo "Extracting frontend files..."
container_id=$(docker create demo-shop-frontend:latest) || {
    echo "Failed to create container"
    exit 1
}

docker cp "$container_id":/app/dist/apps/frontend ./dist/apps/frontend || {
    echo "Failed to copy files from container"
    docker rm "$container_id"
    exit 1
}

docker rm "$container_id" || {
    echo "Failed to remove container"
    exit 1
}

echo "Installing and configuring Sentry CLI..."
npm install -g @sentry/cli || {
    echo "Failed to install Sentry CLI"
    exit 1
}

echo "Processing sourcemaps..."
sentry-cli sourcemaps inject dist/apps/frontend || {
    echo "Failed to inject sourcemaps"
    exit 1
}

sentry-cli sourcemaps upload dist/apps/frontend || {
    echo "Failed to upload sourcemaps"
    exit 1
}

echo "Cleaning up..."
rm -rf ./dist

echo "Sentry processing completed successfully"
