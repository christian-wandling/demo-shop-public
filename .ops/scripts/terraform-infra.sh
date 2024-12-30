#!/bin/bash

set +e
echo "Starting Terraform infra..."

# Init
terraform init
INIT_EXIT=$?
if [ $INIT_EXIT -ne 0 ]; then
    echo "Terraform init failed"
    echo "success=false" >> $GITHUB_OUTPUT
    exit $INIT_EXIT
fi

# Validate
terraform validate
VALIDATE_EXIT=$?
if [ $VALIDATE_EXIT -ne 0 ]; then
    echo "Terraform validate failed"
    echo "success=false" >> $GITHUB_OUTPUT
    exit $VALIDATE_EXIT
fi

# Plan
terraform plan -target module.networking -target module.github_runner -detailed-exitcode -out=tfplan
PLAN_EXIT=$?
if [ $PLAN_EXIT -ne 0 ]; then
    echo "Terraform plan failed"
    echo "success=false" >> $GITHUB_OUTPUT
    exit $PLAN_EXIT
fi

# Apply
terraform apply -auto-approve tfplan
APPLY_EXIT=$?
if [ $APPLY_EXIT -ne 0 ]; then
    echo "Apply failed, synchronizing state..."
    terraform plan \
        -target module.networking \
        -target module.github_runner \
        -compact-warnings \
        -parallelism=50 \
        -no-color | grep "^  # .* will be "
    echo "Current state is:"
    terraform state list
    echo "success=false" >> $GITHUB_OUTPUT
    exit $APPLY_EXIT
else
    echo "Infrastructure deployment successful"
    echo "success=true" >> $GITHUB_OUTPUT
fi
