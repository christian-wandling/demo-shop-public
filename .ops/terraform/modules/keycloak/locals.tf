locals {
  kc_db_url = "jdbc:postgresql://${var.db_address}:5432/${var.kc_db_name}"
  kc_domain = "${cloudflare_record.keycloak.name}.${var.cloudflare_domain_name}"
  health_check_url = "https://${cloudflare_record.keycloak.name}.${var.cloudflare_domain_name}/auth/realms/master"
}
