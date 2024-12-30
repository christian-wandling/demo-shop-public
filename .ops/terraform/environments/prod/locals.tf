locals {
  cloudflare_ips = split("\n", trimspace(data.http.cloudflare_ips.response_body))
  logger         = file("../../../scripts/utils/logger.sh")
  user           = "ec2-user"
  cdn_address    = "cdn.${var.cloudflare_domain_name}"
}
