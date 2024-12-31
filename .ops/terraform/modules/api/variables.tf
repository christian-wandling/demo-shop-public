variable "environment" {
  description = "Environment name"
  type        = string
}

variable "allowed_cidr_blocks" {
  description = "List of allowed IP addresses in CIDR notation"
  type = list(string)
}

variable "identifier_prefix" {
  description = "Prefix for resource identifiers"
  type        = string
}

variable "additional_tags" {
  description = "Additional tags for append"
  type    = map(string)
  default = {}
}

variable "api_ssh_public_key_path" {
  description = "The path of the SSH key for the api"
  type        = string
}

variable "api_ssh_private_key_path" {
  description = "The path of the private SSH key for the api"
  type        = string
}

variable "subnet_id_1" {
  description = "Id of the subnet to use"
  type        = string
}

variable "vpc_id" {
  description = "Id of the VPC"
  type        = string
}

variable "user" {
  description = "Name of the user in ec2"
  type        = string
}

variable "logger" {
  description = "Name of the user in ec2"
  type        = string
  sensitive = true
}

variable "postgres_sg" {
  description = "The name of the security group for the DB"
  type        = string
}

variable "db_address" {
  description = "Database address"
  type        = string
  sensitive   = true
}

variable "app_db_name" {
  description = "The name of the app database"
  type        = string
  sensitive   = true
}

variable "api_db_username" {
  description = "The username for the app database"
  type        = string
  sensitive   = true
}

variable "api_db_password" {
  description = "The password for the app database"
  type        = string
  sensitive   = true
}

variable "keycloak_realm_public_key" {
  description = "The keycloak realm public key"
  type        = string
  sensitive   = true
}

variable "keycloak_client_api" {
  description = "The name of the keycloak client in API"
  type        = string
  sensitive   = true
}

variable "keycloak_realm" {
  description = "The name of the keycloak realm"
  type        = string
  sensitive   = true
}

variable "keycloak_address" {
  description = "The address of the keycloak server"
  type        = string
  sensitive   = true
}

variable "api_docker_image_path" {
  description = "The docker image path for the api"
  type        = string
}

variable frontend_sg {
  description = "The security group for the frontend"
  type        = string
}

variable "keycloak_sg" {
  description = "The security group for keycloak"
  type        = string
}

variable "sentry_demo_shop_api_dsn" {
  description = "The sentry demo shop api dsn"
  type        = string
  sensitive   = true
}

variable "frontend_address" {
  description = "The address of the frontend server"
  type        = string
  sensitive   = true
}

variable "github_runner_sg" {
  description = "The security group for the github runner"
  type        = string
}
