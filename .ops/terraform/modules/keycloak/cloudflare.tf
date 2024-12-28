resource "cloudflare_record" "keycloak" {
  zone_id = var.cloudflare_zone_id
  name    = "sso"
  value   = aws_eip.keycloak.public_ip
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_zone_settings_override" "keycloak_settings" {
  zone_id = var.cloudflare_zone_id
  settings {
    ssl              = "strict"
    min_tls_version  = "1.2"
    always_use_https = "on"
    tls_1_3          = "on"
  }
}

resource "cloudflare_worker_route" "keycloak_security_headers_route" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "${local.kc_domain}/*"
  script_name = var.cloudflare_headers_worker
}

resource "tls_private_key" "keycloak_private_key" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "tls_cert_request" "keycloak_cert_request" {
  private_key_pem = tls_private_key.keycloak_private_key.private_key_pem

  subject {
    common_name  = local.kc_domain
    organization = "Christian Wandling"
    organizational_unit = "IT"
    country            = "AT"
    locality           = "Vienna"
    province           = "Vienna"
  }
}

resource "cloudflare_origin_ca_certificate" "keycloak_cert" {
  csr = tls_cert_request.keycloak_cert_request.cert_request_pem
  hostnames = [
    local.kc_domain
  ]
  request_type       = "origin-rsa"
  requested_validity = 365
}
