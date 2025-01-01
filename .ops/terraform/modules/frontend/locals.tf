locals {
  frontend_domain  = "${cloudflare_record.frontend.name}.${var.cloudflare_domain_name}"
  cert_destination = "/home/ec2-user/certs"
  key_destination  = "/home/ec2-user/keys"
  docker_container_name   = "frontend"
  docker_image_name       = "demo-shop-frontend:latest"
  docker_file_name = "demo-shop-frontend.tar"
}
