variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "demo-shop"
}

variable "allowed_cidr" {
  description = "IP addresses allowed to access the application"
  type        = list(string)
  sensitive   = true
}

variable "keycloak_ssh_public_key_path" {
  description = "The keycloak ssh public key for Keycloak"
  type        = string
}

variable "keycloak_ssh_private_key_path" {
  description = "The keycloak ssh private key path used interactive SSH key to the keycloak server."
  type        = string
}

variable "keycloak_server_cert_path" {
  description = "The keycloak ssl certificate"
  type        = string
}

variable "keycloak_server_key_path" {
  description = "The keycloak ssl certificate key"
  type        = string
}
