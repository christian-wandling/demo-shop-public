locals {
  database_url = "postgresql://${var.api_db_username}:${var.api_db_password}@${var.db_address}:5432/${var.app_db_name}?schema=public"
  docker_container_name = "api"
  docker_image_name = "demo-shop-api:latest"
  docker_file_name = "demo-shop-api.tar"
}
