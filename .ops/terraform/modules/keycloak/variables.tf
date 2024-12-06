variable "allowed_cidr" {
  description = "List of allowed IP addresses in CIDR notation"
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
  description = "The public SSH key"
  type        = string
}

variable "keycloak_ssh_private_key_path" {
  description = "The public SSH key"
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
