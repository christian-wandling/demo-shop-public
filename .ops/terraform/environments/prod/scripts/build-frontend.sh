#!/bin/bash

set -e

handle_error() {
    local exit_code=$?
    local line_number=$1
    echo "Error occurred in build-frontend.sh at line ${line_number}, exit code: ${exit_code}"
    exit $exit_code
}

trap 'handle_error ${LINENO}' ERR

required_vars=(
    "KEYCLOAK_URL"
    "KEYCLOAK_REALM"
    "KEYCLOAK_CLIENT_UI"
    "SENTRY_DEMO_SHOP_UI_DSN"
    "SENTRY_TRUSTED_DOMAIN"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: Missing required environment variable: $var"
        exit 1
    fi
done

echo "Starting Frontend build process..."

echo "Configuring frontend environment..."
envsubst < apps/frontend/src/environments/environment.ts > /tmp/environment.ts || {
    echo "Failed to substitute environment variables"
    exit 1
}

mv /tmp/environment.ts apps/frontend/src/environments/environment.ts || {
    echo "Failed to move environment file"
    exit 1
}

echo "Building Docker image..."
docker build \
    --platform linux/amd64 \
    -f apps/frontend/Dockerfile \
    -t demo-shop-frontend:latest . || {
    echo "Docker build failed"
    exit 1
}

echo "Saving Docker image..."
docker save demo-shop-frontend:latest | tee demo-shop-frontend.tar > /dev/null || {
    echo "Failed to save Docker image"
    exit 1
}

echo "Frontend build process completed successfully"
