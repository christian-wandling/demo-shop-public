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

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.48.0"
    }

    keycloak = {
      source  = "mrparkers/keycloak"
      version = "~> 4.4.0"
    }

    github = {
      source  = "integrations/github"
      version = "6.2.2"
    }
  }

  required_version = ">= 1.10.0"

  backend "s3" {
    bucket         = "demo-shop-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}




