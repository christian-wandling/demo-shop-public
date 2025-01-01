variable "environment" {
  description = "Environment name"
  type        = string
}

variable "identifier_prefix" {
  description = "Prefix for resource identifiers"
  type        = string
}

variable "allowed_cidr_blocks" {
  description = "List of allowed IP addresses in CIDR notation"
  type = list(string)
}

variable "cloudflare_ips" {
  description = "List of allowed IP addresses from cloudflare"
  type = list(string)
}

variable "additional_tags" {
  description = "Additional tags for append"
  type    = map(string)
  default = {}
}

variable "frontend_ssh_public_key_path" {
  description = "The path of the SSH key for the frontend"
  type        = string
}

variable "frontend_ssh_private_key_path" {
  description = "The path of the private SSH key for the frontend"
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

variable api_sg {
  description = "The security group for the api"
  type        = string
}

variable keycloak_sg {
  description = "The security group for keycloak"
  type        = string
}

variable "frontend_docker_image_path" {
  description = "The docker image path for the frontend"
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

variable "dhparam_file_path" {
  description = "The path of the dhparam file"
  type        = string
}

variable "api_address" {
  description = "The address of the api"
  type        = string
  sensitive   = true
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

