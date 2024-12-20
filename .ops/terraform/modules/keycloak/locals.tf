locals {
  kc_db_url = "jdbc:postgresql://${var.db_address}:5432/${var.kc_db_name}"
  logger = file("../../../scripts/utils/logger.sh")
  user = "ec2-user"
  kc_domain = "sso.${var.cloudflare_domain_name}"
}
