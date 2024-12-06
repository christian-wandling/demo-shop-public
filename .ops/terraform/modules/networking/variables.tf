variable "aws_region" {
  description = "AWS region"
  type        = string
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
  type    = map(string)
  default = {}
}
