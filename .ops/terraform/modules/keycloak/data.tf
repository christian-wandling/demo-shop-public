data "aws_ssm_parameter" "keycloak_admin" {
  name = "/keycloak/${var.environment}/KEYCLOAK_ADMIN"
}

data "aws_ssm_parameter" "keycloak_admin_password" {
  name = "/keycloak/${var.environment}/KEYCLOAK_ADMIN_PASSWORD"
}

data "aws_ssm_parameter" "kc_db_username" {
  name = "/keycloak/${var.environment}/KC_DB_USERNAME"
}

data "aws_ssm_parameter" "kc_db_password" {
  name = "/keycloak/${var.environment}/KC_DB_PASSWORD"
}
