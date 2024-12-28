data "aws_ssm_parameter" "db_username" {
  name = "/database/${var.environment}/DB_USERNAME"
}

data "aws_ssm_parameter" "db_password" {
  name = "/database/${var.environment}/DB_PASSWORD"
}

data "aws_ssm_parameter" "kc_db_name" {
  name = "/database/${var.environment}/KC_DB_NAME"
}

data "aws_ssm_parameter" "kc_db_username" {
  name = "/keycloak/${var.environment}/KC_DB_USERNAME"
}

data "aws_ssm_parameter" "kc_db_password" {
  name = "/keycloak/${var.environment}/KC_DB_PASSWORD"
}
