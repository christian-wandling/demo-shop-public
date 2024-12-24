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

variable "allowed_cidr_blocks" {
  description = "IP addresses allowed to access the application"
  type        = list(string)
  sensitive   = true
}

variable "keycloak_ssh_public_key_path" {
  description = "The path of the ssh public key for Keycloak"
  type        = string
}

variable "keycloak_ssh_private_key_path" {
  description = "The path of the ssh private key for Keycloak"
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

variable "cloudflare_api_token" {
  description = "The API token for Cloudflare"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "The id of the zone that will be used by the Cloudflare account"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "The id of the cloudflare account"
  type        = string
  sensitive   = true
}

variable "cloudflare_domain_name" {
  description = "Your domain name"
  type        = string
}

variable "api_ssh_public_key_path" {
  description = "The path of the ssh public key for the api"
  type        = string
}

variable "api_ssh_private_key_path" {
  description = "The path of the ssh private key for the api"
  type        = string
}

variable "api_docker_image_path" {
  description = "The docker image path for the api"
  type        = string
}
