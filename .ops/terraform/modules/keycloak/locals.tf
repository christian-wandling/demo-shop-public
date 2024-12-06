locals {
  kc_db_url = "jdbc:postgresql://${var.db_address}:5432/${var.kc_db_name}"
  logger = file("../../../scripts/utils/logger.sh")
  log_file_path = "/var/log/keycloak-deployment.log"
  user = "ec2-user"
}
