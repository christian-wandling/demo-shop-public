#!/bin/bash

# Enable debug
set -x

# Signal handling
cleanup() {
    local exit_code=$?
    echo "::debug::Cleanup triggered with exit code: $exit_code"

    # Try to sync state
    echo "::debug::Attempting state sync..."
    terraform plan -no-color > /dev/null 2>&1 || true
    terraform state list > /dev/null 2>&1 || true

    echo "::debug::Cleanup complete"
    exit $exit_code
}

trap cleanup SIGINT SIGTERM ERR EXIT

echo "::debug::Starting Terraform services..."

# Init
echo "::debug::Initializing Terraform..."
terraform init
INIT_EXIT=$?
echo "::debug::Init exit code: $INIT_EXIT"
if [ $INIT_EXIT -ne 0 ]; then
    echo "::error::Terraform init failed"
    exit $INIT_EXIT
fi

# Validate
echo "::debug::Validating Terraform configuration..."
terraform validate
VALIDATE_EXIT=$?
echo "::debug::Validate exit code: $VALIDATE_EXIT"
if [ $VALIDATE_EXIT -ne 0 ]; then
    echo "::error::Terraform validate failed"
    exit $VALIDATE_EXIT
fi

# Plan
echo "::debug::Planning Terraform changes..."
terraform plan -detailed-exitcode -out=tfplan
PLAN_EXIT=$?
echo "::debug::Plan exit code: $PLAN_EXIT"
if [ $PLAN_EXIT -eq 1 ]; then
    echo "::error::Terraform plan failed"
    exit 1
fi

# Small delay to ensure process completion
sleep 2

# Apply
echo "::debug::Applying Terraform changes..."
if ! terraform apply -auto-approve tfplan; then
    APPLY_EXIT=$?
    echo "::error::Apply failed or was cancelled with exit code: $APPLY_EXIT"
    exit $APPLY_EXIT
fi

echo "::debug::Services deployment successful"

# Safely capture URL
echo "::debug::Capturing frontend URL..."
FRONTEND_URL=$(terraform output -raw frontend_url 2>/dev/null || echo "")
if [ ! -z "$FRONTEND_URL" ]; then
    echo "url=$FRONTEND_URL" >> $GITHUB_OUTPUT
fi

exit 0
