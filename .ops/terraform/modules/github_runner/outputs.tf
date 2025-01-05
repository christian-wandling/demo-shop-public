output "github_runner_sg" {
  description = "The github runner server security group"
  value       = aws_security_group.github_runner_sg.id
}
