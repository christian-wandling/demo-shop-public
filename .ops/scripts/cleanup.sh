#!/bin/bash
set -e

# Cleanup all sensitive files
rm -rf .secrets
rm -rf tmp
rm -f .ops/terraform/prod/terraform/tfplan
rm -f *.pem
rm -f *_ssh_*
rm -f demo-shop-api.tar
rm -f demo-shop-frontend.tar
