locals {
  kc_db_url = "jdbc:postgresql://${var.db_address}:5432/${var.kc_db_name}"
  kc_domain = "sso.${var.cloudflare_domain_name}"
}
