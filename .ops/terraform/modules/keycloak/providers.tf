terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }

    keycloak = {
      source  = "mrparkers/keycloak"
      version = "~> 4.4.0"
    }
  }
}
