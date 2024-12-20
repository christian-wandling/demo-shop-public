data "aws_ssm_parameter" "app_db_name" {
  name = "/database/${var.environment}/APP_DB_NAME"
}

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

data "aws_ssm_parameter" "api_db_username" {
  name = "/api/${var.environment}/API_DB_USERNAME"
}

data "aws_ssm_parameter" "api_db_password" {
  name = "/api/${var.environment}/API_DB_PASSWORD"
}

data "http" "cloudflare_ips" {
  url = "https://www.cloudflare.com/ips-v4"
}
