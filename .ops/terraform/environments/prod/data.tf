data "aws_ssm_parameter" "app_db_name" {
  name = "/database/${var.environment}/APP_DB_NAME"
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

data "aws_ssm_parameter" "keycloak_admin" {
  name = "/keycloak/${var.environment}/KEYCLOAK_ADMIN"
}

data "aws_ssm_parameter" "keycloak_admin_password" {
  name = "/keycloak/${var.environment}/KEYCLOAK_ADMIN_PASSWORD"
}

data "aws_caller_identity" "current" {}

data "terraform_remote_state" "this" {
  backend = "local"
  config = {
    path = "./terraform.tfstate"
  }
}
