resource "aws_instance" "keycloak" {
  ami           = "ami-0e54671bdf3c8ed8d"
  instance_type = "t2.micro"
  monitoring    = false
  subnet_id     = var.subnet_id_1
  key_name      = aws_key_pair.keycloak_key_pub.key_name

  associate_public_ip_address = true

  iam_instance_profile = aws_iam_instance_profile.keycloak_profile.name

  vpc_security_group_ids = [aws_security_group.keycloak_sg.id]

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

  user_data = templatefile("${path.module}/scripts/bootstrap.sh.tftpl", {
    user          = var.user
    logger        = var.logger
    log_file_path = "/var/log/bootstrap.log"
  })

  tags = merge(
    {
      Name        = "${var.identifier_prefix}-keycloak-server-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "terraform_data" "keycloak_deploy" {
  triggers_replace = {
    instance_id             = aws_instance.keycloak.id
    kc_hostname             = aws_eip.keycloak.public_ip
    kc_db_password          = data.aws_ssm_parameter.kc_db_password.value
    kc_db_url               = local.kc_db_url
    kc_db_username          = data.aws_ssm_parameter.kc_db_username.value
    keycloak_admin          = var.keycloak_admin
    keycloak_admin_password = var.keycloak_admin_password
    script_hash = filesha256("${path.module}/scripts/deploy.sh.tftpl")
    cert_hash               = cloudflare_origin_ca_certificate.keycloak_cert.certificate
    key_hash                = tls_private_key.keycloak_private_key.private_key_pem
  }

  connection {
    type = "ssh"
    host = var.is_local ? aws_eip.keycloak.public_ip : aws_eip.keycloak.private_ip
    user = var.user
    private_key = file(var.keycloak_ssh_private_key_path)
  }

  provisioner "remote-exec" {
    inline = [
      "mkdir -p /home/ec2-user/secrets"
    ]
  }

  provisioner "file" {
    content     = cloudflare_origin_ca_certificate.keycloak_cert.certificate
    destination = "/home/ec2-user/secrets/cert.pem"
  }

  provisioner "file" {
    content     = tls_private_key.keycloak_private_key.private_key_pem
    destination = "/home/ec2-user/secrets/key.pem"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo chmod 644 /home/ec2-user/secrets/cert.pem",
      "sudo chmod 600 /home/ec2-user/secrets/key.pem",
      "sudo chmod 755 /home/ec2-user/secrets",
      "sudo chown 1000:1000 /home/ec2-user/secrets/cert.pem",
      "sudo chown 1000:1000 /home/ec2-user/secrets/key.pem"
    ]
  }

  provisioner "remote-exec" {
    inline = [
      templatefile("${path.module}/scripts/deploy.sh.tftpl", {
        kc_hostname             = local.kc_domain
        kc_db_password          = data.aws_ssm_parameter.kc_db_password.value
        kc_db_url               = local.kc_db_url
        kc_db_username          = data.aws_ssm_parameter.kc_db_username.value
        keycloak_admin          = var.keycloak_admin
        keycloak_admin_password = var.keycloak_admin_password
        user                    = var.user
        logger                  = var.logger
        log_file_path           = "/var/log/deploy.log"
      }),
    ]
  }
}

resource "terraform_data" "keycloak_health_check" {
  input = aws_instance.keycloak.id

  provisioner "local-exec" {
    command = <<-EOF
      until curl -k --fail "https://${local.kc_domain}" || [ $SECONDS -gt 300 ]; do
        echo "Waiting for Keycloak..."
        sleep 10
      done
      [ $SECONDS -le 300 ]
    EOF
  }
}



