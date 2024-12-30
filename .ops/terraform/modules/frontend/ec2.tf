resource "aws_instance" "frontend" {
  ami           = "ami-0e54671bdf3c8ed8d"
  instance_type = "t2.micro"
  monitoring    = false
  subnet_id     = var.subnet_id_1
  key_name      = aws_key_pair.frontend_key_pub.key_name

  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.frontend_sg.id]

  iam_instance_profile = aws_iam_instance_profile.frontend_profile.name

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
      Name        = "${var.identifier_prefix}-frontend-server-${var.environment}"
      Environment = var.environment
      Managed_by  = "terraform",
    },
    var.additional_tags
  )
}

resource "terraform_data" "frontend_deploy" {
  triggers_replace = {
    instance_id = aws_instance.frontend.id
    script_hash = filesha256("${path.module}/scripts/deploy.sh.tftpl"),
    image_hash  = var.frontend_docker_image_path && filesha256(var.frontend_docker_image_path),
    cert_hash   = cloudflare_origin_ca_certificate.frontend_cert.certificate
    key_hash    = tls_private_key.frontend_private_key.private_key_pem
  }

  connection {
    type = "ssh"
    host = aws_instance.frontend.public_ip
    user = var.user
    private_key = file(var.frontend_ssh_private_key_path)
  }

  provisioner "remote-exec" {
    inline = [
      "mkdir -p /home/ec2-user/certs",
      "mkdir -p /home/ec2-user/keys"
    ]
  }

  provisioner "file" {
    source      = var.frontend_docker_image_path
    destination = "/home/ec2-user/demo-shop-frontend.tar"
  }

  provisioner "file" {
    content     = cloudflare_origin_ca_certificate.frontend_cert.certificate
    destination = "${local.cert_destination}/nginx-server.crt"
  }

  provisioner "file" {
    content     = data.http.cloudflare_origin_root_cert.response_body
    destination = "${local.cert_destination}/origin-pull-ca.pem"
  }

  provisioner "file" {
    content     = tls_private_key.frontend_private_key.private_key_pem
    destination = "${local.key_destination}/nginx-server.key"
  }

  provisioner "file" {
    source      = var.dhparam_file_path
    destination = "${local.cert_destination}/dhparam.pem"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo chmod 600 ${local.key_destination}/nginx-server.key",
      "sudo chmod 644 ${local.cert_destination}/dhparam.pem",
      "sudo chmod 644 ${local.cert_destination}/nginx-server.crt",
      "sudo chmod 644 ${local.cert_destination}/origin-pull-ca.pem",
      "sudo chmod 755 ${local.key_destination}",
      "sudo chmod 755 ${local.cert_destination}",
      "sudo chown 1000:1000 ${local.key_destination}/nginx-server.key",
      "sudo chown 1000:1000 ${local.cert_destination}/dhparam.pem",
      "sudo chown 1000:1000 ${local.cert_destination}/nginx-server.crt",
      "sudo chown 1000:1000 ${local.cert_destination}/origin-pull-ca.pem",
    ]
  }

  provisioner "remote-exec" {
    inline = [
      templatefile("${path.module}/scripts/deploy.sh.tftpl", {
        user             = var.user
        logger           = var.logger
        log_file_path    = "/var/log/deploy.log"
        cert_destination = local.cert_destination
        key_destination  = local.key_destination
        api_url          = var.api_address
      })
    ]
  }

}
