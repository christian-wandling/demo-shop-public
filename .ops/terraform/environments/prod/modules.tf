module "database" {
  source = "../../modules/database"

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

  api_sg = module.api.api_sg
  depends_on = [
    module.networking
  ]
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
  keycloak_server_cert_path     = var.keycloak_server_cert_path
  keycloak_server_key_path      = var.keycloak_server_key_path
  cloudflare_domain_name        = var.cloudflare_domain_name
  cloudflare_zone_id            = var.cloudflare_zone_id
  cloudflare_ips                = local.cloudflare_ips
  logger                        = local.logger
  user                          = local.user
  cloudflare_headers_worker     = cloudflare_worker_script.security_headers.name
  keycloak_admin                = data.aws_ssm_parameter.keycloak_admin.value
  keycloak_admin_password       = data.aws_ssm_parameter.keycloak_admin_password.value
  keycloak_client_api           = data.aws_ssm_parameter.keycloak_client_api.value
  keycloak_client_ui            = data.aws_ssm_parameter.keycloak_client_ui.value
  keycloak_realm_name           = data.aws_ssm_parameter.keycloak_realm_name.value
  vpc_id                        = module.networking.vpc_id
  subnet_id_1                   = module.networking.subnet_id_1
  db_address                    = module.database.db_address
  kc_db_name                    = module.database.kc_db_name
  postgres_sg                   = module.database.postgres_sg
  fe_address                    = ""
}

module "api" {
  source = "../../modules/api"

  allowed_cidr_blocks       = var.allowed_cidr_blocks
  environment               = var.environment
  identifier_prefix         = var.project_name
  api_ssh_public_key_path   = var.api_ssh_public_key_path
  api_ssh_private_key_path  = var.api_ssh_private_key_path
  api_docker_image_path     = var.api_docker_image_path
  api_db_password           = data.aws_ssm_parameter.api_db_password.value
  api_db_username           = data.aws_ssm_parameter.api_db_username.value
  app_db_name               = data.aws_ssm_parameter.app_db_name.value
  keycloak_client_api       = data.aws_ssm_parameter.keycloak_client_api.value
  keycloak_realm_name       = data.aws_ssm_parameter.keycloak_realm_name.value
  logger                    = local.logger
  user                      = local.user
  vpc_id                    = module.networking.vpc_id
  subnet_id_1               = module.networking.subnet_id_1
  postgres_sg               = module.database.postgres_sg
  db_address                = module.database.db_address
  keycloak_realm_public_key = module.keycloak.keycloak_realm_public_key
  keycloak_address          = module.keycloak.keycloak_address

  depends_on = [
    module.networking
  ]
}

module "networking" {
  source = "../../modules/networking"

  environment       = var.environment
  aws_region        = var.aws_region
  identifier_prefix = var.project_name
}
