variable "allowed_cidr_blocks" {
  description = "List of allowed IP addresses in CIDR notation"
  type = list(string)
}

variable "cloudflare_ips" {
  description = "List of allowed IP addresses from cloudflare"
  type = list(string)
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "identifier_prefix" {
  description = "Prefix for resource identifiers"
  type        = string
}

variable "additional_tags" {
  description = "Additional tags for append"
  type = map(string)
  default = {}
}

variable "subnet_id_1" {
  description = "Id of the subnet to use"
  type        = string
}

variable "vpc_id" {
  description = "Id of the VPC"
  type        = string
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

variable "kc_db_name" {
  description = "The name of the keycloak database"
  type        = string
  sensitive   = true
}

variable "keycloak_ssh_public_key_path" {
  description = "The path of the public SSH key for keycloak"
  type        = string
}

variable "keycloak_ssh_private_key_path" {
  description = "The path of the private SSH key for keycloak"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "The id of the zone that will be used by the Cloudflare account"
  type        = string
  sensitive   = true
}

variable "cloudflare_domain_name" {
  description = "Your domain name"
  type        = string
}

variable "cloudflare_headers_worker" {
  description = "Response machine headers"
  type = string
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

variable "keycloak_admin" {
  description = "The keycloak admin user"
  type        = string
  sensitive   = true
}

variable "keycloak_admin_password" {
  description = "The keycloak admin password"
  type        = string
  sensitive   = true
}

variable "keycloak_realm_name" {
  description = "The name of the keycloak realm"
  type        = string
  sensitive   = true
}

variable "keycloak_client_ui" {
  description = "The name of the keycloak client in UI"
  type        = string
  sensitive   = true
}

variable "keycloak_client_api" {
  description = "The name of the keycloak client in API"
  type        = string
  sensitive   = true
}

variable frontend_sg {
  description = "The security group for the frontend"
  type        = string
}

variable frontend_address {
  description = "The security group for the frontend"
  type        = string
}

variable "github_runner_sg" {
  description = "The security group for the github runner"
  type        = string
}

variable "is_local" {
  description = "True if running from local machine, false if running from runner"
  type        = bool
  default     = false
}
