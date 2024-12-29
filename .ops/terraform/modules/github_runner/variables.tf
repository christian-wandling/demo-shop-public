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

variable "github_token" {
  description = "GitHub Runner Token"
  sensitive   = true
}

variable "vpc_id" {
  description = "Id of the VPC"
  type        = string
}

variable "subnet_id_1" {
  description = "Id of the subnet to use"
  type        = string
}

variable "github_runner_ssh_public_key_path" {
  description = "The path of the public SSH key for the github runner"
  type        = string
}

variable "github_runner_ssh_private_key_path" {
  description = "The path of the private SSH key for the github runner"
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

variable "repository_url" {
  description = "The url of the github repository"
  type        = string
  sensitive   = true
}

variable "postgres_sg" {
  description = "The name of the security group for the DB"
  type        = string
}

variable "keycloak_sg" {
  description = "The security group for keycloak"
  type        = string
}


