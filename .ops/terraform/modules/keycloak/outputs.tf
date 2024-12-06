output "keycloak_sg" {
  description = "The keycloak server security group"
  value       = aws_security_group.keycloak_sg.id
}
