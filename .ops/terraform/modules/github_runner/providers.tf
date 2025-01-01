terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }

    github = {
      source  = "integrations/github"
      version = "6.2.2"
    }
  }
}
