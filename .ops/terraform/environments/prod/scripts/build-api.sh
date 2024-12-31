#!/bin/bash

set -e

handle_error() {
    local exit_code=$?
    local line_number=$1
    echo "Error occurred in build-api.sh at line ${line_number}, exit code: ${exit_code}"
    exit $exit_code
}

trap 'handle_error ${LINENO}' ERR

if [ -z "${SENTRY_AUTH_TOKEN}" ] || [ -z "${SENTRY_ORG}" ] || [ -z "${SENTRY_DEMO_SHOP_API_PROJECT}" ]; then
    echo "Error: Missing required environment variables"
    echo "Required: SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_DEMO_SHOP_API_PROJECT"
    exit 1
fi

echo "Starting API build process..."

echo "Building Docker image..."
docker build \
    --platform linux/amd64 \
    --build-arg SENTRY_AUTH_TOKEN="${SENTRY_AUTH_TOKEN}" \
    --build-arg SENTRY_ORG="${SENTRY_ORG}" \
    --build-arg SENTRY_DEMO_SHOP_API_PROJECT="${SENTRY_DEMO_SHOP_API_PROJECT}" \
    -f apps/backend/Dockerfile \
    -t demo-shop-api:latest . || {
        echo "Docker build failed"
        exit 1
    }

echo "Saving Docker image..."
docker save demo-shop-api:latest | tee demo-shop-api.tar > /dev/null || {
    echo "Failed to save Docker image"
    exit 1
}

echo "API build process completed successfully"
