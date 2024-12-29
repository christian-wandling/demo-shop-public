resource "aws_instance" "github_runner" {
  ami           = "ami-0e5ec0326a194d2c9"
  instance_type = "t2.micro"
  monitoring    = false
  subnet_id     = var.subnet_id_1
  key_name      = aws_key_pair.github_runner_key_pub.key_name

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

  user_data = templatefile("${path.module}/scripts/user_data.sh.tftpl", {
    user          = var.user
    logger        = var.logger
    token         = var.github_token
    url           = var.repository_url
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
