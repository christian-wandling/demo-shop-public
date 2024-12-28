output "db_identifier" {
  description = "The identifier of the RDS instance"
  value       = aws_db_instance.postgres.identifier
}

  output "db_address" {
  description = "The address of the RDS instance"
  value       = aws_db_instance.postgres.address
  sensitive = true
}

output "db_endpoint" {
  description = "The endpoint of the RDS instance"
  value       = aws_db_instance.postgres.endpoint
  sensitive = true
}

output "db_username" {
  description = "The username that can be used to connect to the database"
  value       = aws_db_instance.postgres.username
  sensitive   = true
}

output "db_password" {
  description = "The password which can be used to connect to the database"
  value       = aws_db_instance.postgres.password
  sensitive   = true
}

output "db_port" {
  description = "The port the RDS instance is listening on"
  value       = aws_db_instance.postgres.port
  sensitive   = true
}

output "kc_db_name" {
  description = "The name of the keycloak database"
  value = data.aws_ssm_parameter.kc_db_name.value
  sensitive = true
}

output "postgres_sg" {
  description = "The ID of the postgresql database"
  value = aws_security_group.postgres_sg.id
}

output "app_db_connection" {
  description = "The connection string for the app database"
  value = "postgresql://${postgresql_role.api_db_user.name}:${postgresql_role.api_db_user.password}@${aws_db_instance.postgres.endpoint}/${aws_db_instance.postgres.db_name}"
  sensitive = true
}
