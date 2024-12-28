#!/bin/bash
set -e

# Cleanup all sensitive files
rm -rf .secrets
rm -f tfplan
rm -f *.pem
rm -f *_ssh_*
