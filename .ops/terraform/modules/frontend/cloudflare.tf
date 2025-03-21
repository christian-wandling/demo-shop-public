resource "cloudflare_record" "frontend" {
  zone_id = var.cloudflare_zone_id
  name    = "demo-shop"
  value   = aws_eip.frontend.public_ip
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_zone_settings_override" "frontend_settings" {
  zone_id = var.cloudflare_zone_id
  settings {
    ssl              = "strict"
    min_tls_version  = "1.2"
    always_use_https = "on"
    tls_1_3          = "on"
  }
}

resource "cloudflare_worker_route" "frontend_security_headers_route" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "${local.frontend_domain}/*"
  script_name = var.cloudflare_headers_worker
}

resource "tls_private_key" "frontend_private_key" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "tls_cert_request" "frontend_cert_request" {
  private_key_pem = tls_private_key.frontend_private_key.private_key_pem

  subject {
    common_name  = local.frontend_domain
    organization = "Christian Wandling"
    organizational_unit = "IT"
    country            = "AT"
    locality           = "Vienna"
    province           = "Vienna"
  }
}

resource "cloudflare_origin_ca_certificate" "frontend_cert" {
  csr = tls_cert_request.frontend_cert_request.cert_request_pem
  hostnames = [
    local.frontend_domain
  ]
  request_type       = "origin-rsa"
  requested_validity = 365
}
