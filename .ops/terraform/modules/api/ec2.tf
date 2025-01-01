resource "aws_instance" "api" {
  ami           = "ami-0e54671bdf3c8ed8d"
  instance_type = "t2.micro"
  monitoring    = false
  subnet_id     = var.subnet_id_1
  key_name      = aws_key_pair.api_key_pub.key_name

  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.api_sg.id]

  iam_instance_profile = aws_iam_instance_profile.api_profile.name

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
      Name        = "${var.identifier_prefix}-api-server-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "terraform_data" "api_deploy" {
  triggers_replace = {
    instance_id               = aws_instance.api.id
    database_url              = local.database_url
    keycloak_realm_public_key = var.keycloak_realm_public_key
    keycloak_client_api       = var.keycloak_client_api
    keycloak_realm            = var.keycloak_realm
    keycloak_url              = var.keycloak_address
    script_hash = filesha256("${path.module}/scripts/deploy.sh.tftpl")
    image_hash                = fileexists(var.api_docker_image_path) ? filesha256(var.api_docker_image_path) : null
  }

  connection {
    type = "ssh"
    host = var.is_local ? aws_instance.api.public_ip : aws_instance.api.private_ip
    user = var.user
    private_key = file(var.api_ssh_private_key_path)
  }

  provisioner "file" {
    source      = var.api_docker_image_path
    destination = "/home/ec2-user/demo-shop-api.tar"
  }

  provisioner "remote-exec" {
    inline = [
      templatefile("${path.module}/scripts/deploy.sh.tftpl", {
        user                      = var.user
        logger                    = var.logger
        log_file_path             = "/var/log/deploy.log"
        database_url              = local.database_url
        container_name            = local.container_name
        keycloak_realm_public_key = var.keycloak_realm_public_key
        keycloak_client_api       = var.keycloak_client_api
        keycloak_realm            = var.keycloak_realm
        keycloak_url              = "https://${var.keycloak_address}"
        frontend_url              = "https://${var.frontend_address}"
        sentry_demo_shop_api_dsn  = var.sentry_demo_shop_api_dsn
      })
    ]
  }
}


resource "terraform_data" "db_migrations" {
  depends_on = [terraform_data.api_deploy]

  triggers_replace = {
    deploy_id = terraform_data.api_deploy.id
  }

  connection {
    type = "ssh"
    host = var.is_local ? aws_instance.api.public_ip : aws_instance.api.private_ip
    user = var.user
    private_key = file(var.api_ssh_private_key_path)
  }

  provisioner "remote-exec" {
    inline = [
      "docker exec ${local.container_name} npx prisma migrate deploy || exit 1"
    ]
  }
}
