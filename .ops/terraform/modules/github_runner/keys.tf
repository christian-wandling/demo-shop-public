resource "tls_private_key" "github_runner" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "aws_key_pair" "github_runner_key_pub" {
  key_name   = "${var.identifier_prefix}-github-runner-key-pub-${var.environment}"
  public_key = file(var.github_runner_ssh_public_key_path)

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-github-runner-key-pub-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

# Output private key for saving
output "private_key_pem" {
  value     = tls_private_key.github_runner.private_key_pem
  sensitive = true
}

# Output public key
output "public_key_openssh" {
  value     = tls_private_key.github_runner.public_key_openssh
  sensitive = true
}
