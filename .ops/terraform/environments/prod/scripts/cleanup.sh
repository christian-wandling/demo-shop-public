#!/bin/bash
set -e

# Cleanup all sensitive files
rm -rf ./.secrets
rm -rf ./tmp
rm -rf ./artifacts
rm -f .ops/terraform/prod/terraform/tfplan
rm -f *.pem
rm -f *_ssh_*
