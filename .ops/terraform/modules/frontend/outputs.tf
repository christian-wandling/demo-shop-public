output "frontend_sg" {
  description = "The frontend server security group"
  value       = aws_security_group.frontend_sg.id
}

output "frontend_address" {
  description = "The address of the frontend"
  value       = local.frontend_domain
}
