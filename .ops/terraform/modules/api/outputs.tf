output "api_sg" {
  description = "The api server security group"
  value       = aws_security_group.api_sg.id
}

output "api_private_ip" {
  description = "The private ip address of the api server"
  value       = aws_instance.api.private_ip
}

output "api_public_ip" {
  description = "The public ip address of the api server"
  value       = aws_instance.api.public_ip
}
