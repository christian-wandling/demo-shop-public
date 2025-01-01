data "aws_ssm_parameter" "kc_db_username" {
  name = "/keycloak/${var.environment}/KC_DB_USERNAME"
}

data "aws_ssm_parameter" "kc_db_password" {
  name = "/keycloak/${var.environment}/KC_DB_PASSWORD"
}

data "keycloak_realm_keys" "keycloak_realm_keys" {
  realm_id = keycloak_realm.demo_shop.id
  algorithms = ["AES", "RS256"]
  status     = ["ACTIVE", "PASSIVE"]

  depends_on = [
    aws_instance.keycloak
  ]
}
