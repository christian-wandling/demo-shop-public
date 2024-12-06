resource "aws_instance" "keycloak" {
  ami           = "ami-0e5ec0326a194d2c9"
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
    user          = local.user
    logger        = local.logger
    log_file_path = local.log_file_path
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
    keycloak_admin_password = data.aws_ssm_parameter.keycloak_admin_password.value
    keycloak_admin          = data.aws_ssm_parameter.keycloak_admin.value
    script_hash = filesha256("${path.module}/scripts/deploy.sh.tftpl"),
    cert_hash = filesha256(var.keycloak_server_cert_path),
    key_hash = filesha256(var.keycloak_server_key_path),
  }

  connection {
    type = "ssh"
    host = aws_eip.keycloak.public_ip
    user = local.user  # or your instance's user
    private_key = file(var.keycloak_ssh_private_key_path)
  }

  provisioner "remote-exec" {
    inline = [
      "mkdir -p /home/ec2-user/secrets"
    ]
  }

  provisioner "file" {
    source      = var.keycloak_server_cert_path
    destination ="/home/ec2-user/secrets/cert.pem"
  }

  provisioner "file" {
    source      = var.keycloak_server_key_path
    destination = "/home/ec2-user/secrets/key.pem"
  }

  provisioner "remote-exec" {
    inline = [
      templatefile("${path.module}/scripts/deploy.sh.tftpl", {
        kc_hostname                   = aws_eip.keycloak.public_dns
        kc_db_password                = data.aws_ssm_parameter.kc_db_password.value
        kc_db_url                     = local.kc_db_url
        kc_db_username                = data.aws_ssm_parameter.kc_db_username.value
        keycloak_admin_password       = data.aws_ssm_parameter.keycloak_admin_password.value
        keycloak_admin                = data.aws_ssm_parameter.keycloak_admin.value
        logger                        = local.logger
        log_file_path                 = local.log_file_path
      })
    ]
  }

}


