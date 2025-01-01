locals {
  frontend_domain = "${cloudflare_record.frontend.name}.${var.cloudflare_domain_name}"
  cert_destination = "/home/ec2-user/certs"
  key_destination = "/home/ec2-user/keys"
  container_name = "demo-shop-frontend:latest"
}
