resource "postgresql_role" "api_db_user" {
  name                                = data.aws_ssm_parameter.api_db_username.value
  password                            = data.aws_ssm_parameter.api_db_password.value
  login                               = true
  skip_drop_role                      = false
  valid_until                         = "infinity"
  create_database                     = false
  bypass_row_level_security           = false
  encrypted_password                  = true
  replication                         = false
  skip_reassign_owned                 = false
  create_role                         = false
  inherit                             = true
  superuser                           = false
  assume_role                         = ""
  idle_in_transaction_session_timeout = 0
  statement_timeout                   = 0
  depends_on = [
    aws_db_instance.postgres
  ]
}

resource "postgresql_role" "keycloak_db_user" {
  name                                = data.aws_ssm_parameter.kc_db_username.value
  password                            = data.aws_ssm_parameter.kc_db_password.value
  login                               = true
  skip_drop_role                      = false
  valid_until                         = "infinity"
  create_database                     = false
  bypass_row_level_security           = false
  encrypted_password                  = true
  replication                         = false
  skip_reassign_owned                 = false
  create_role                         = false
  inherit                             = true
  superuser                           = false
  assume_role                         = ""
  idle_in_transaction_session_timeout = 0
  statement_timeout                   = 0
  depends_on = [
    aws_db_instance.postgres
  ]
}

resource "postgresql_database" "keycloak" {
  name              = data.aws_ssm_parameter.kc_db_name.value
  owner             = postgresql_role.keycloak_db_user.name
  template          = "template0"
  encoding          = "UTF8"
  connection_limit  = -1
  allow_connections = true
  depends_on = [
    aws_db_instance.postgres
  ]
}

resource "postgresql_grant" "keycloak_privileges" {
  database          = postgresql_database.keycloak.name
  role              = postgresql_role.keycloak_db_user.name
  schema            = "public"
  object_type       = "database"
  privileges = ["CONNECT", "CREATE", "TEMPORARY"]
  with_grant_option = false
  depends_on = [
    aws_db_instance.postgres
  ]
}

resource "postgresql_grant" "keycloak_schema_privileges" {
  database          = postgresql_database.keycloak.name
  role              = postgresql_role.keycloak_db_user.name
  schema            = "public"
  object_type       = "schema"
  privileges = ["USAGE", "CREATE"]
  with_grant_option = false
  depends_on = [
    aws_db_instance.postgres
  ]
}

resource "postgresql_grant" "app_privileges" {
  database          = aws_db_instance.postgres.db_name
  role              = postgresql_role.api_db_user.name
  schema            = "public"
  object_type       = "database"
  privileges = ["CONNECT", "CREATE", "TEMPORARY"]
  with_grant_option = false
  depends_on = [
    aws_db_instance.postgres
  ]
}

resource "postgresql_grant" "app_schema_privileges" {
  database          = aws_db_instance.postgres.db_name
  role              = postgresql_role.api_db_user.name
  schema            = "public"
  object_type       = "schema"
  privileges = ["USAGE", "CREATE"]
  with_grant_option = false
  depends_on = [
    aws_db_instance.postgres
  ]
}
