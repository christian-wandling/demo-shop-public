#!/bin/bash

set +e

echo "Starting Terraform operations..."

# Init
terraform init
INIT_EXIT=$?
if [ $INIT_EXIT -ne 0 ]; then
  echo "Terraform init failed"
  exit $INIT_EXIT
fi

# Validate
terraform validate
VALIDATE_EXIT=$?
if [ $VALIDATE_EXIT -ne 0 ]; then
  echo "Terraform validate failed"
  exit $VALIDATE_EXIT
fi

# Plan
terraform plan -detailed-exitcode -out=tfplan
PLAN_EXIT=$?
if [ $PLAN_EXIT -ne 0 ]; then
  echo "Terraform plan failed"
  exit $PLAN_EXIT
fi

# Apply
terraform apply -auto-approve tfplan
APPLY_EXIT=$?
if [ $APPLY_EXIT -ne 0 ]; then
  echo "Apply failed, synchronizing state..."
  terraform plan \
    -compact-warnings \
    -parallelism=50 \
    -no-color | grep "^  # .* will be "
  echo "Current state is:"
  terraform state list
  exit $APPLY_EXIT
fi
