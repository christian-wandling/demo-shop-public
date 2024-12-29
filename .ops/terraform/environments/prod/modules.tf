module "database" {
  source = "../../modules/database"

  depends_on = [
    module.networking
  ]

  environment         = var.environment
  identifier_prefix   = var.project_name
  allowed_cidr_blocks = var.allowed_cidr_blocks
  api_db_password     = data.aws_ssm_parameter.api_db_password.value
  api_db_username     = data.aws_ssm_parameter.api_db_username.value
  app_db_name         = data.aws_ssm_parameter.app_db_name.value
  subnet_id_1         = module.networking.subnet_id_1
  subnet_id_2         = module.networking.subnet_id_2
  vpc_id              = module.networking.vpc_id
  keycloak_sg         = module.keycloak.keycloak_sg
  api_sg              = module.api.api_sg
}

module "keycloak" {
  source = "../../modules/keycloak"

  depends_on = [
    module.networking
  ]

  allowed_cidr_blocks           = var.allowed_cidr_blocks
  environment                   = var.environment
  identifier_prefix             = var.project_name
  keycloak_ssh_public_key_path  = var.keycloak_ssh_public_key_path
  keycloak_ssh_private_key_path = var.keycloak_ssh_private_key_path
  cloudflare_domain_name        = var.cloudflare_domain_name
  cloudflare_zone_id            = var.cloudflare_zone_id
  cloudflare_headers_worker     = cloudflare_worker_script.security_headers.name
  cloudflare_ips                = local.cloudflare_ips
  logger                        = local.logger
  user                          = local.user
  keycloak_admin                = data.aws_ssm_parameter.keycloak_admin.value
  keycloak_admin_password       = data.aws_ssm_parameter.keycloak_admin_password.value
  keycloak_client_api           = var.keycloak_client_api
  keycloak_client_ui            = var.keycloak_client_ui
  keycloak_realm_name           = var.keycloak_realm
  vpc_id                        = module.networking.vpc_id
  subnet_id_1                   = module.networking.subnet_id_1
  db_address                    = module.database.db_address
  kc_db_name                    = module.database.kc_db_name
  postgres_sg                   = module.database.postgres_sg
  frontend_sg                   = module.frontend.frontend_sg
  frontend_address              = module.frontend.frontend_address
}

module "api" {
  source = "../../modules/api"

  depends_on = [
    module.networking
  ]

  allowed_cidr_blocks       = var.allowed_cidr_blocks
  environment               = var.environment
  identifier_prefix         = var.project_name
  api_ssh_public_key_path   = var.api_ssh_public_key_path
  api_ssh_private_key_path  = var.api_ssh_private_key_path
  api_docker_image_path     = var.api_docker_image_path
  keycloak_client_api       = var.keycloak_client_api
  keycloak_realm            = var.keycloak_realm
  sentry_demo_shop_api_dsn  = var.sentry_demo_shop_api_dsn
  api_db_password           = data.aws_ssm_parameter.api_db_password.value
  api_db_username           = data.aws_ssm_parameter.api_db_username.value
  app_db_name               = data.aws_ssm_parameter.app_db_name.value
  logger                    = local.logger
  user                      = local.user
  vpc_id                    = module.networking.vpc_id
  subnet_id_1               = module.networking.subnet_id_1
  postgres_sg               = module.database.postgres_sg
  db_address                = module.database.db_address
  keycloak_realm_public_key = module.keycloak.keycloak_realm_public_key
  keycloak_address          = module.keycloak.keycloak_address
  keycloak_sg               = module.keycloak.keycloak_sg
  frontend_sg               = module.frontend.frontend_sg
  frontend_address          = module.frontend.frontend_address
}

module "frontend" {
  source = "../../modules/frontend"

  depends_on = [
    module.networking
  ]

  allowed_cidr_blocks           = var.allowed_cidr_blocks
  environment                   = var.environment
  identifier_prefix             = var.project_name
  frontend_ssh_private_key_path = var.frontend_ssh_private_key_path
  frontend_ssh_public_key_path  = var.frontend_ssh_public_key_path
  frontend_docker_image_path    = var.frontend_docker_image_path
  cloudflare_domain_name        = var.cloudflare_domain_name
  cloudflare_zone_id            = var.cloudflare_zone_id
  dhparam_file_path             = var.dhparam_file_path
  cloudflare_headers_worker     = cloudflare_worker_script.security_headers.name
  cloudflare_ips                = local.cloudflare_ips
  logger                        = local.logger
  user                          = local.user
  api_sg                        = module.api.api_sg
  keycloak_sg                   = module.keycloak.keycloak_sg
  subnet_id_1                   = module.networking.subnet_id_1
  vpc_id                        = module.networking.vpc_id
  api_address                   = module.api.api_private_ip
}

module "github_runner" {
  source                             = "../../modules/github_runner"
  allowed_cidr_blocks                = var.allowed_cidr_blocks
  environment                        = var.environment
  github_runner_ssh_private_key_path = var.github_runner_ssh_private_key_path
  github_runner_ssh_public_key_path  = var.github_runner_ssh_public_key_path
  github_token                       = var.github_token
  identifier_prefix                  = var.project_name
  repository_url                     = var.repository_url
  logger                             = local.logger
  user                               = local.user
  vpc_id                             = module.networking.vpc_id
  subnet_id_1                        = module.networking.subnet_id_1
  keycloak_sg                        = module.keycloak.keycloak_sg
  postgres_sg                        = module.database.postgres_sg
}

module "networking" {
  source = "../../modules/networking"

  environment       = var.environment
  aws_region        = var.aws_region
  identifier_prefix = var.project_name
}
