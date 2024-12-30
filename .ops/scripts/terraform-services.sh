#!/bin/bash
set -e  # Exit on error
trap 'handle_error $?' ERR  # Trap errors

handle_error() {
    local exit_code=$1
    echo "Error occurred with exit code: $exit_code"

    # Sync state on failure
    echo "Synchronizing state..."
    terraform plan \
        -compact-warnings \
        -parallelism=50 \
        -no-color | grep "^  # .* will be " || true

    echo "Current state is:"
    terraform state list || true

    exit $exit_code
}

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
terraform plan -detailed-exitcode -out=tfplan
PLAN_EXIT=$?
if [ $PLAN_EXIT -ne 0 ] && [ $PLAN_EXIT -ne 2 ]; then
    echo "Terraform plan failed"
    exit $PLAN_EXIT
fi

# Apply
echo "Applying Terraform changes..."
terraform apply -auto-approve tfplan
APPLY_EXIT=$?
if [ $APPLY_EXIT -ne 0 ]; then
    echo "Apply failed"
    exit $APPLY_EXIT
fi

echo "Services deployment successful"

# Capture URL for deployment status
FRONTEND_URL=$(terraform output -raw frontend_url || echo "")
if [ ! -z "$FRONTEND_URL" ]; then
    echo "url=$FRONTEND_URL" >> $GITHUB_OUTPUT
fi

exit 0
