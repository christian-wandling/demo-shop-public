terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.79.0"
    }

    postgresql = {
      source  = "cyrilgdn/postgresql"
      version = "~>1.22.0"
    }
  }

  required_version = ">= 1.10.0"

  backend "s3" {
    bucket  = "demo-shop-terraform-state"
    key     = "prod/terraform.tfstate"
    region  = "eu-central-1"
    encrypt = true
  }
}


