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

  ssl_required          = "external"
  access_token_lifespan = "300s"
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
}

resource "keycloak_openid_client" "demo_shop_api" {
  realm_id              = keycloak_realm.demo_shop.id
  client_id             = var.keycloak_client_api
  name                  = "Demo shop API"
  enabled               = true
  access_type           = "BEARER-ONLY"
  standard_flow_enabled = false
}

resource "keycloak_role" "buy_products" {
  realm_id  = keycloak_realm.demo_shop.id
  name      = "buy_products"
}

resource "keycloak_default_roles" "default_roles" {
  realm_id = keycloak_realm.demo_shop.id
  default_roles = [
    keycloak_role.buy_products.name
  ]
}
