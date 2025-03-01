resource "keycloak_realm" "demo_shop" {
  realm        = var.keycloak_realm_name
  enabled      = true
  display_name = "Demo Shop"

  registration_allowed           = true
  registration_email_as_username = true
  remember_me                    = true
  login_with_email_allowed       = true
  duplicate_emails_allowed       = false
  reset_password_allowed         = true

  security_defenses {
    headers {
      x_frame_options                     = "DENY"
      content_security_policy             = "frame-src 'self'; frame-ancestors 'self'; object-src 'none';"
      content_security_policy_report_only = ""
      x_content_type_options              = "nosniff"
      x_robots_tag                        = "none"
      x_xss_protection                    = "1; mode=block"
      strict_transport_security           = "max-age=31536000; includeSubDomains"
    }
    brute_force_detection {
      permanent_lockout                 = false
      max_login_failures                = 30
      wait_increment_seconds            = 60
      quick_login_check_milli_seconds   = 1000
      minimum_quick_login_wait_seconds  = 60
      max_failure_wait_seconds          = 900
      failure_reset_time_seconds        = 43200
    }
  }

  ssl_required          = "external"
  access_token_lifespan = "300s"

  depends_on = [
    terraform_data.keycloak_health_check,
    aws_vpc_security_group_ingress_rule.keycloak_ingress_github_runner,
    aws_vpc_security_group_ingress_rule.keycloak_ingress_https_allowed_ranges,
    cloudflare_record.keycloak,
    cloudflare_worker_route.keycloak_security_headers_route,
    cloudflare_zone_settings_override.keycloak_settings,
    cloudflare_origin_ca_certificate.keycloak_cert
  ]
}

resource "keycloak_openid_client" "demo_shop_ui" {
  realm_id                     = keycloak_realm.demo_shop.id
  client_id                    = var.keycloak_client_ui
  name                         = "Demo shop UI"
  enabled                      = true
  access_type                  = "PUBLIC"
  standard_flow_enabled        = true
  direct_access_grants_enabled = true

  valid_redirect_uris = [
    "https://${var.frontend_address}/*"
  ]

  web_origins = [
    "https://${var.frontend_address}"
  ]

  depends_on = [
    terraform_data.keycloak_health_check,
    aws_vpc_security_group_ingress_rule.keycloak_ingress_github_runner,
    aws_vpc_security_group_ingress_rule.keycloak_ingress_https_allowed_ranges,
    cloudflare_record.keycloak,
    cloudflare_worker_route.keycloak_security_headers_route,
    cloudflare_zone_settings_override.keycloak_settings,
    cloudflare_origin_ca_certificate.keycloak_cert
  ]
}

resource "keycloak_openid_client" "demo_shop_api" {
  realm_id              = keycloak_realm.demo_shop.id
  client_id             = var.keycloak_client_api
  name                  = "Demo shop API"
  enabled               = true
  access_type           = "BEARER-ONLY"
  standard_flow_enabled = false

  depends_on = [
    terraform_data.keycloak_health_check,
    aws_vpc_security_group_ingress_rule.keycloak_ingress_github_runner,
    aws_vpc_security_group_ingress_rule.keycloak_ingress_https_allowed_ranges,
    cloudflare_record.keycloak,
    cloudflare_worker_route.keycloak_security_headers_route,
    cloudflare_zone_settings_override.keycloak_settings,
    cloudflare_origin_ca_certificate.keycloak_cert
  ]
}

resource "keycloak_role" "buy_products" {
  realm_id = keycloak_realm.demo_shop.id
  name     = "buy_products"

  depends_on = [
    terraform_data.keycloak_health_check,
    aws_vpc_security_group_ingress_rule.keycloak_ingress_github_runner,
    aws_vpc_security_group_ingress_rule.keycloak_ingress_https_allowed_ranges,
    cloudflare_record.keycloak,
    cloudflare_worker_route.keycloak_security_headers_route,
    cloudflare_zone_settings_override.keycloak_settings,
    cloudflare_origin_ca_certificate.keycloak_cert
  ]
}

resource "keycloak_default_roles" "default_roles" {
  realm_id = keycloak_realm.demo_shop.id
  default_roles = [
    keycloak_role.buy_products.name
  ]

  depends_on = [
    terraform_data.keycloak_health_check,
    aws_vpc_security_group_ingress_rule.keycloak_ingress_github_runner,
    aws_vpc_security_group_ingress_rule.keycloak_ingress_https_allowed_ranges,
    cloudflare_record.keycloak,
    cloudflare_worker_route.keycloak_security_headers_route,
    cloudflare_zone_settings_override.keycloak_settings,
    cloudflare_origin_ca_certificate.keycloak_cert
  ]
}
