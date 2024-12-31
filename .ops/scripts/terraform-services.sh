#!/bin/bash
set -e

echo "Starting Terraform services..."

# Init
terraform init
if [ $? -ne 0 ]; then
    echo "Terraform init failed"
    exit 1
fi

# Validate
terraform validate
if [ $? -ne 0 ]; then
    echo "Terraform validate failed"
    exit 1
fi

# Plan
terraform plan -detailed-exitcode -out=tfplan
PLAN_EXIT=$?
if [ $PLAN_EXIT -eq 1 ]; then
    echo "Terraform plan failed"
    exit 1
fi

# Apply
if ! terraform apply -auto-approve tfplan; then
    echo "Apply failed"
    exit 1
fi

# Capture URL for deployment status
FRONTEND_URL=$(terraform output -raw frontend_url 2>/dev/null || echo "")
if [ ! -z "$FRONTEND_URL" ]; then
    echo "url=$FRONTEND_URL" >> $GITHUB_OUTPUT
fi

exit 0
