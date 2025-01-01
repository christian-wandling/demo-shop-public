resource "aws_instance" "github_runner" {
  ami                         = "ami-0e54671bdf3c8ed8d"
  instance_type               = "t2.micro"
  monitoring                  = false
  subnet_id                   = var.subnet_id_1
  key_name                    = aws_key_pair.github_runner_key_pub.key_name

  associate_public_ip_address = true

  iam_instance_profile = aws_iam_instance_profile.github_runner_profile.name

  vpc_security_group_ids = [aws_security_group.github_runner_sg.id]

  # Add IMDSv2 requirement
  metadata_options {
    http_tokens   = "required"
    http_endpoint = "enabled"
  }

  root_block_device {
    volume_size = 8
    volume_type = "gp2"
    encrypted   = true
  }

  lifecycle {
    ignore_changes = [
      user_data
    ]
  }

  connection {
    type        = "ssh"
    user        = var.user
    host        = self.public_ip
    private_key = file(var.github_runner_ssh_private_key_path)
  }

  provisioner "file" {
    content = <<-EOF
    Host ${var.keycloak_private_ip}
      IdentityFile ~/.ssh/keycloak_key
      User ec2-user

    Host ${var.api_private_ip}
      IdentityFile ~/.ssh/api_key
      User ec2-user

    Host ${var.frontend_private_ip}
      IdentityFile ~/.ssh/frontend_key
      User ec2-user
  EOF
    destination = "/home/ec2-user/.ssh/config"
  }

  provisioner "file" {
    content     = file(var.keycloak_ssh_private_key_path)
    destination = "/home/ec2-user/.ssh/keycloak_key"
  }

  provisioner "file" {
    content     = file(var.api_ssh_private_key_path)
    destination = "/home/ec2-user/.ssh/api_key"
  }

  provisioner "file" {
    content     = file(var.frontend_ssh_private_key_path)
    destination = "/home/ec2-user/.ssh/frontend_key"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo chmod 600 /home/ec2-user/.ssh/keycloak_key",
      "sudo chmod 600 /home/ec2-user/.ssh/api_key",
      "sudo chmod 600 /home/ec2-user/.ssh/frontend_key",
      "sudo chmod 600 /home/ec2-user/.ssh/config"
    ]
  }

  provisioner "remote-exec" {
    inline = [
      "sudo ssh-keyscan ${var.keycloak_private_ip} >> ~/.ssh/known_hosts",
      "sudo ssh-keyscan ${var.frontend_private_ip} >> ~/.ssh/known_hosts",
      "sudo ssh-keyscan ${var.api_private_ip} >> ~/.ssh/known_hosts"
    ]
  }

  user_data = templatefile("${path.module}/scripts/user_data.sh.tftpl", {
    user          = var.user
    logger        = var.logger
    token         = data.github_actions_registration_token.runner.token
    url           = "https://github.com/${var.github_org}/${var.github_repo}"
    log_file_path = "/var/log/user_data.log"
  })

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-github-runner-server-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "terraform_data" "remove_ssh" {
  depends_on = [aws_instance.github_runner]

  provisioner "local-exec" {
    command = "aws ec2 revoke-security-group-ingress --group-id ${aws_security_group.github_runner_sg.id} --protocol tcp --port 22 --cidr ${chomp(data.http.my_ip.response_body)}/32"
  }
}
