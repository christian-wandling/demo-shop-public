provider "aws" {
  region = var.aws_region
}

provider "postgresql" {
  host            = split(":", module.database.db_endpoint)[0]
  port            = module.database.db_port
  database        = data.aws_ssm_parameter.app_db_name.value
  username        = module.database.db_username
  password        = module.database.db_password
  sslmode         = "require"
  superuser       = false
  connect_timeout = 15
  max_connections = 20
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "keycloak" {
  client_id = "admin-cli"
  username  = data.aws_ssm_parameter.keycloak_admin.value
  password  = data.aws_ssm_parameter.keycloak_admin_password.value
  url       = "https://${module.keycloak.keycloak_address}"
}
