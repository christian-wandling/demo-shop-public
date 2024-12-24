locals {
  database_url = "postgresql://${var.api_db_username}:${var.api_db_password}@${var.db_address}:5432/${var.app_db_name}?schema=public"
}
