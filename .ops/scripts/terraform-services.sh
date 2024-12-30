#!/bin/bash

# Signal handling
cleanup() {
    local exit_code=$?
    echo "Caught exit signal - cleaning up..."

    # Try to sync state
    terraform plan -no-color > /dev/null 2>&1 || true
    terraform state list > /dev/null 2>&1 || true

    echo "Exiting with code: $exit_code"
    exit $exit_code
}

trap cleanup SIGINT SIGTERM ERR EXIT

echo "Starting Terraform services..."

# Init
echo "Initializing Terraform..."
terraform init
if [ $? -ne 0 ]; then
    echo "Terraform init failed"
    exit 1
fi

# Validate
echo "Validating Terraform configuration..."
terraform validate
if [ $? -ne 0 ]; then
    echo "Terraform validate failed"
    exit 1
fi

# Plan
echo "Planning Terraform changes..."
terraform plan -detailed-exitcode -out=tfplan || {
    echo "Terraform plan failed"
    exit 1
}

# Apply
echo "Applying Terraform changes..."
if ! terraform apply -auto-approve tfplan; then
    echo "Apply failed or was cancelled"
    exit 1
fi

echo "Services deployment successful"

# Safely capture URL
FRONTEND_URL=$(terraform output -raw frontend_url 2>/dev/null || echo "")
if [ ! -z "$FRONTEND_URL" ]; then
    echo "url=$FRONTEND_URL" >> $GITHUB_OUTPUT
fi

exit 0
