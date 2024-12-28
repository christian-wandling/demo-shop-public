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

variable "subnet_id_1" {
  description = "Id of the subnet to use"
  type        = string
}

variable "subnet_id_2" {
  description = "Second subnet ID for RDS"
  type        = string
}

variable "vpc_id" {
  description = "Id of the VPC"
  type        = string
}

variable "additional_tags" {
  description = "Additional tags for append"
  type = map(string)
  default = {}
}

variable "keycloak_sg" {
  description = "The security group for keycloak"
  type        = string
}

variable "api_sg" {
  description = "The security group for the api"
  type        = string
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
