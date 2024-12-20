provider "aws" {
  region = var.aws_region
}

provider "postgresql" {
  host            = split(":", module.database.db_endpoint)[0]
  port            = module.database.db_port
  database        = module.database.app_db_name
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
