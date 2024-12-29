#!/bin/bash
set -e

mkdir -p .secrets

echo "${API_SSH_PRIVATE_KEY}" > .secrets/api_ssh_private_key
echo "${API_SSH_PUBLIC_KEY}" > .secrets/api_ssh_public_key
echo "${RUNNER_SSH_PRIVATE_KEY}" > .secrets/github_runner_ssh_private_key
echo "${RUNNER_SSH_PUBLIC_KEY}" > .secrets/github_runner_ssh_public_key
echo "${FRONTEND_SSH_PRIVATE_KEY}" > .secrets/frontend_ssh_private_key
echo "${FRONTEND_SSH_PUBLIC_KEY}" > .secrets/frontend_ssh_public_key
echo "${KEYCLOAK_SSH_PRIVATE_KEY}" > .secrets/keycloak_ssh_private_key
echo "${KEYCLOAK_SSH_PUBLIC_KEY}" > .secrets/keycloak_ssh_public_key
echo "${KEYCLOAK_SERVER_CERT}" > .secrets/keycloak_server_cert.pem
echo "${KEYCLOAK_SERVER_KEY}" > .secrets/keycloak_server_key.pem
echo "${DH_PARAM}" > .secrets/dhparam.pem

chmod 600 .secrets/*
