module "database" {
  source = "../../modules/database"

  environment         = var.environment
  identifier_prefix   = var.project_name
  allowed_cidr_blocks = var.allowed_cidr_blocks
  subnet_id_1         = module.networking.subnet_id_1
  subnet_id_2         = module.networking.subnet_id_2
  vpc_id              = module.networking.vpc_id

  keycloak_sg = module.keycloak.keycloak_sg
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
  cloudflare_ips                = local.cloudflare_ips
  environment                   = var.environment
  identifier_prefix             = var.project_name
  keycloak_ssh_public_key_path  = var.keycloak_ssh_public_key_path
  keycloak_ssh_private_key_path = var.keycloak_ssh_private_key_path
  keycloak_server_cert_path     = var.keycloak_server_cert_path
  keycloak_server_key_path      = var.keycloak_server_key_path
  cloudflare_domain_name        = var.cloudflare_domain_name
  cloudflare_zone_id            = var.cloudflare_zone_id
  vpc_id                        = module.networking.vpc_id
  subnet_id_1                   = module.networking.subnet_id_1
  db_address                    = module.database.db_address
  kc_db_name                    = module.database.kc_db_name
  postgres_sg                   = module.database.postgres_sg
  cloudflare_headers_worker     = cloudflare_worker_script.security_headers.name
}

module "networking" {
  source = "../../modules/networking"

  environment         = var.environment
  aws_region          = var.aws_region
  identifier_prefix   = var.project_name
}
