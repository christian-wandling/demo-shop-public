#!/bin/bash
set -e

echo "Starting Terraform infra..."

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

# Plan infrastructure modules
terraform plan \
    -target module.networking \
    -target module.github_runner \
    -detailed-exitcode \
    -out=tfplan

if [ $? -eq 1 ]; then
    echo "Terraform plan failed"
    exit 1
fi

# Apply
if ! terraform apply -auto-approve tfplan; then
    echo "Apply failed"
    exit 1
fi

echo "Infra deployment successful"
exit 0
